// Helpers for payments
const config = require('config');
const paypal = require('paypal-rest-sdk');
const Order = require('../models/order');
const Payment = require('../models/payment');
const OrderItem = require('../models/orderItem');
const FinalizedOrder = require('../models/finalizedOrder');
const PaymentStatus = require('../enums/PaymentStatus');
const PaymentMethods = require('../enums/PaymentMethods');
const { TAX_RATE } = require('../utils/constant');
const { capitalize } = require('../helpers/string');

// Create and send link to paypal payment
exports.startPaypalPayment = async (req, res, next) => {
    try {
        const orderId = req.body.orderId;
        const readyDate = req.body.readyDate;
        const locationId = req.body.locationId;

        // Ensure order exists
        let foundOrder = await Order.findOne({ _id: orderId, creator: req.userId });

        if(!foundOrder) {
            return res.status(404).end("Order doesn't exist");
        }

        let foundFinalizedOrder = await FinalizedOrder.findOne({ order: orderId });

        if(foundFinalizedOrder && foundFinalizedOrder.status == PaymentStatus.paid) {
            return res.status(409).end("Finalized order already paid for");
        }

        // Find payment if already existing
        let foundPayment = await Payment.findOne({ order: orderId });

        // Update / create payment
        if(foundPayment && foundPayment._doc.status === PaymentStatus.paid) {
            return res.status(409).end("Order already paid for"); 
        }

        let newPayment;
        if(foundPayment) {
            foundPayment.status = PaymentStatus.unpaid;
            foundPayment.paymentMethod = PaymentMethods.paypal;
            newPayment = foundPayment;
        } else {
            newPayment = new Payment({
                order: orderId,
                status: PaymentStatus.unpaid,
                paymentMethod: PaymentMethods.paypal
            });
        }
        let internalPayment = await newPayment.save();

        let orderItems = await Promise.all(foundOrder.items.map((orderItemId) => OrderItem.findById(orderItemId).populate('product', 'name customizations').populate('toppings')));

        let transactions = [];
        let item_list = {};
        let amount = {};
        let description = `Order ID: ${foundOrder._doc._id}`;
        let items = [];

        // Populate items array for receipt
        orderItems.forEach(orderItem => {
            let item = {};
            let toppingsPrice = orderItem.toppings.reduce((val, curTopping) => val + curTopping.price, 0);

            let drinkSizePrice = orderItem.product.customizations.sizes.find((size) => size.value === orderItem.customizations.size).price;

            item.name = `${capitalize(orderItem.customizations.size)} ${orderItem.product.name}, sugar: ${orderItem.customizations.sugarLevel}, ice: ${orderItem.customizations.iceLevel}`;
            item.sku = orderItem._id;
            item.quantity = orderItem.quantity;
            item.currency = "CAD";
            item.price = ((toppingsPrice + drinkSizePrice) * TAX_RATE).toFixed(2);

            items.push(item);
        });


        // Populate item_list
        item_list.items = items;

        // Calculate total amount
        amount.currency = "CAD";
        amount.total = foundOrder.total;
        
        // Set transactions
        transactions = {
            item_list: item_list,
            amount: amount,
            description: description
        }

        const createPaymentConfig = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: `${config.get("CLIENT_HOST")}/success/${foundOrder._doc._id}?paymentMethod=${PaymentMethods.paypal}&readyDate=${readyDate}&locationId=${locationId}`,
                cancel_url: `${config.get("CLIENT_HOST")}/cancel/${foundOrder._doc._id}?paymentMethod=${PaymentMethods.paypal}&internalPaymentId=${internalPayment._doc._id}`
            },
            transactions: [transactions]
        };


        paypal.payment.create(createPaymentConfig, async (err, payment) => {
            if(err) {
                throw err;
            } else {
                for(let i = 0; i < payment.links.length; i++) {
                    if(payment.links[i].rel === 'approval_url') {
                        internalPayment.status = PaymentStatus.pending;
                        internalPayment.externalPaymentId = payment.id;

                        await internalPayment.save();

                        return res.status(200).json({ redirect: payment.links[i].href });
                    }
                }
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).end("Could not create payment");
    }
};

// Pay in store helper function
exports.payInStore = async (req, res, next) => {
    try {        
        const orderId = req.body.orderId;
        const readyDate = req.body.readyDate;
        const locationId = req.body.locationId;

        // Ensure order exists
        let foundOrder = await Order.findOne({ _id: orderId, creator: req.userId });

        if(!foundOrder) {
            return res.status(404).end("Order doesn't exist");
        }

        if(foundOrder._doc.items.length == 0) {
            return res.status(400).end("Cannot pay for empty order"); 
        }

        // Ensure finalized order doesn't exist with specified order id
        let foundFinalizedOrder = await FinalizedOrder.findOne({ order: orderId });
        if(foundFinalizedOrder) {
            return res.status(409).end("Order already finalized"); 
        }

        // Find payment if already existing
        let foundPayment = await Payment.findOne({ order: orderId });

        // Update / create payment
        if(foundPayment && foundPayment._doc.status === PaymentStatus.paid) {
            return res.status(409).end("Order already paid for"); 
        }

        let result;
        if(foundPayment) {
            foundPayment.status = PaymentStatus.unpaid;
            foundPayment.paymentMethod = PaymentMethods.instore;
            foundPayment.externalPaymentId = undefined;
            result = await foundPayment.save();
        } else {
            let newPayment = new Payment({
                order: orderId,
                status: PaymentStatus.unpaid,
                paymentMethod: PaymentMethods.instore
            });   
            result = await newPayment.save(); 
        }

        let finalizedOrder = new FinalizedOrder({
            order: orderId,
            payment: result._doc._id,
            location: locationId,
            readyDate: new Date(readyDate),
            finalizedDate: new Date()
        });

        await finalizedOrder.save();

        return res.status(200).end("Please complete payment in store");
    } catch (e) {
        return res.status(500).end("Could not setup payment in store");
    }
};

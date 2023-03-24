// REST api for paypal payments
// endpoints relative to /rest/payment/paypal
const express = require('express');
const config = require('config');
const paypal = require('paypal-rest-sdk');
const Order = require('../../../models/order');
const Payment = require('../../../models/payment');
const FinalizedOrder = require('../../../models/finalizedOrder');
const PaymentStatus = require('../../../enums/PaymentStatus');
const Errors = require('../../../utils/error');

let router = express.Router();

paypal.configure({
    mode: 'sandbox',
    client_id: config.get("PAYPAL_OPTIONS").client_id,
    client_secret: config.get("PAYPAL_OPTIONS").client_secret
});

router.post('/success', async (req, res, next) => {
    try {
        const orderId = req.body.orderId;
        const payerId = req.body.PayerID;
        const paymentId = req.body.paymentId;
        const readyDate = req.body.readyDate;
        const locationId = req.body.locationId;

        if(!req.isAuth) return res.status(401).end(Errors.ErrorData.UNAUTHORIZED.message); 

        // Ensure order exists created by user
        let foundOrder = await Order.findOne({ _id: orderId, creator: req.userId });
        
        if(!foundOrder) return res.status(404).end("Order doesn't exist");

        // Ensure finalized order exists
        let foundPayment = await Payment.findOne({ externalPaymentId: paymentId });

        if(!foundPayment) return res.status(404).end("Payment doesn't exist");


        // Create paypal payment config
        const executePaymentConfig = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: "CAD",
                        total: foundOrder.total
                    }
                }
            ]
        };

        // Execute payment
        paypal.payment.execute(paymentId, executePaymentConfig, async (err, payment) => { 
            if(err) {
                console.log(err);
                throw err;
            } else {
                if(payment.state === 'approved') {
                    let result = await Payment.findOneAndUpdate({ externalPaymentId: paymentId }, { status: PaymentStatus.paid });
                    
                    // Create finalized order
                    let finalizedOrder = new FinalizedOrder({
                        order: foundOrder._doc._id,
                        payment: result._doc._id,
                        location: locationId,
                        readyDate: new Date(readyDate),
                        finalizedDate: new Date()
                    });

                    try {
                        await finalizedOrder.save();
                    } catch(e) {
                        // do nothing
                    }
                    res.status(200).end("Success");
                }
            }
        });
    } catch (e) {
        return res.status(500).end("Could not execute payment");
    }
});

router.post('/cancel', async (req, res, next) => {
    const orderId = req.body.orderId;
    const internalPaymentId = req.body.internalPaymentId;

    try {
        if(!req.isAuth) return res.status(401).end(Errors.ErrorData.UNAUTHORIZED.message); 

        // Find related order
        let foundOrder = await Order.findOne({ _id: orderId, creator: req.userId });
        if(!foundOrder) return res.status(404).end("Order doesn't exist");

        let foundPayment = await Payment.findById(internalPaymentId);
        if(!foundPayment) return res.status(404).end("Payment doesn't exist");

        if(foundPayment.status == PaymentStatus.paid) return res.status(409).end("Order already paid for");


        // Find finalized order
        let foundFinalizedOrder = await FinalizedOrder.findOne({payment: foundPayment._doc._id });

        foundPayment.status = PaymentStatus.unpaid;
        await foundPayment.save();

        if(foundFinalizedOrder) {
            await foundFinalizedOrder.remove()
        }

        return res.status(200).send('Cancelled');
    } catch (e) {
        return res.status(500).end("Could not cancel");
    }
});

module.exports = router;
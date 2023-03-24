// Exports resolvers related to finalized orders

const Order = require('../../models/order');
const FinalizedOrder = require('../../models/finalizedOrder');
const { nestOrder, nestPayment, nestLocation } = require('../../helpers/nestDocument');
const { PAGE_SIZE } = require('../../utils/constant');
const { ErrorTypes } = require('../../utils/error');

module.exports = {
    finalizedOrders: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }

            // Extract arguments
            var argPage = args.queryPageInput.page;

            // Get order ids
            let foundOrders = await Order.find({ creator: req.userId });
            let orderIds = foundOrders.map(order => order._doc._id);

            // Get selected page of finalized orders
            let foundFinalizedOrders = await FinalizedOrder.find({order: { $in: orderIds }}).skip(argPage * PAGE_SIZE).limit(PAGE_SIZE).exec();

            return foundFinalizedOrders.map((finalizedOrder) => {
                return {
                    ...finalizedOrder._doc,
                    order: nestOrder.bind(this, finalizedOrder._doc.order),
                    payment: nestPayment.bind(this, finalizedOrder._doc.payment),
                    readyDate: new Date(finalizedOrder._doc.readyDate).toISOString(),
                    location: nestLocation.bind(this, finalizedOrder._doc.location),
                    finalizedDate: new Date(finalizedOrder._doc.finalizedDate).toISOString()
                };
            });

        } catch (e) {
            throw e;
        }
    },
    finalizedOrder: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }

            // Extract arguments
            var argOrderId = args.queryFinalizedOrderInput.orderId;

            // Get order Id of specified finalized order
            let foundFinalizedOrder = await FinalizedOrder.findOne({ order: argOrderId });

            // Ensure order creator is authenticated user
            let foundOrder = await Order.findOne({ _id: argOrderId, creator: req.userId });
                
            if(!foundOrder||!foundFinalizedOrder) {
                throw new Error(ErrorTypes.FINALIZED_ORDER_DNE);
            }

            return {
                ...foundFinalizedOrder._doc,
                order: nestOrder.bind(this, foundFinalizedOrder._doc.order),
                payment: nestPayment.bind(this, foundFinalizedOrder._doc.payment),
                readyDate: new Date(foundFinalizedOrder._doc.readyDate).toISOString(),
                location: nestLocation.bind(this, foundFinalizedOrder._doc.location),
                finalizedDate: new Date(foundFinalizedOrder._doc.finalizedDate).toISOString()
            };
        } catch(e) {
            throw e;
        }       
    }
}
// Exports resolvers related to orders

const Order = require('../../models/order');
const FinalizedOrder = require('../../models/finalizedOrder');
const { nestUser, nestOrderItems, nestOrder } = require('../../helpers/nestDocument');
const { PAGE_SIZE } = require('../../utils/constant');
const { ErrorTypes } = require('../../utils/error');

module.exports = {
    orders: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }
    
            // Extract arguments
            var argPage = args.queryPageInput.page;
    
            let finalizedOrdersOrder = await (await FinalizedOrder.find({}).select({"order": 1, "_id": 0}));
            let finalizedOrdersOrderIds = finalizedOrdersOrder.map(finalizedOrdersOrder => finalizedOrdersOrder.order);

            // Get orders created by user
            let orders = await Order.find({ creator: req.userId, _id: { "$nin": finalizedOrdersOrderIds} }).skip(argPage * PAGE_SIZE).limit(PAGE_SIZE).exec();

            return orders.map(order => {
                return {
                    ...order._doc,
                    creator: nestUser.bind(this, order._doc.creator),
                    items: nestOrderItems.bind(this, order._doc.items)
                };                
            });
        } catch (e) {
            throw e;
        }
    },
    order: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }
    
            // Extract arguments
            var argOrderId = args.queryOrderInput.orderId;
    
            // Ensure order exists created by user
            let order = await Order.findOne({ creator: req.userId, _id: argOrderId })
            if(!order) {
                throw new Error(ErrorTypes.ORDER_DNE);
            }
    
            return nestOrder(order._doc._id);
        } catch(e) {
            throw e;
        }
    },
    createOrder: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }
        
            // Construct order
            const order = new Order({
                creator: req.userId,
                total: 0
            });
    
            let result = await order.save();

            return { 
                ...result._doc,
                creator: nestUser.bind(this, result._doc.creator) 
            };
        } catch (e) {
            throw e;
        }
    }
}
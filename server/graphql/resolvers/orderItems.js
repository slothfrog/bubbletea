// Exports resolvers related to order items

const OrderItem = require('../../models/orderItem');
const Product = require('../../models/product');
const Order = require('../../models/order');
const FinalizedOrder = require('../../models/finalizedOrder');
const { nestOrder, nestProduct, nestToppings } = require('../../helpers/nestDocument');
const { validValues } = require('../../helpers/validators');
const { calculateOrderTotal } = require('../../helpers/calculate');
const { ErrorTypes } = require('../../utils/error');

module.exports = {
    createOrderItem: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }

            // Extract arguments
            var argQuantity = args.createOrderItemInput.quantity;
            var argOrderId = args.createOrderItemInput.orderId;
            var argProductId = args.createOrderItemInput.productId;
            var argSize = args.createOrderItemInput.size;
            var argSugarLevel = args.createOrderItemInput.sugarLevel;
            var argIceLevel = args.createOrderItemInput.iceLevel;
            var argToppings = args.createOrderItemInput.toppings || [];

            if(argQuantity <= 0) {
                throw new Error(ErrorTypes.INVALID_QUANTITY);
            }

            argQuantity = Math.floor(argQuantity);

            // Ensure order id exists
            let foundOrder = await Order.findOne({ creator: req.userId, _id: argOrderId});
            if(!foundOrder) {
                throw Error(ErrorTypes.ORDER_DNE);
            }

            // Ensure order not already finalized
            let alreadyFinalized = await FinalizedOrder.findOne({ order: argOrderId});
            if(alreadyFinalized) {
                throw Error(ErrorTypes.ALREADY_FINALIZED);
            }

            // Ensure product id exists
            let foundProduct = await Product.findById(argProductId);
            if(!foundProduct) {
                throw Error(ErrorTypes.PRODUCT_DNE);
            }

            // Ensure selected customization and toppings supported by product
            let validSize = validValues([argSize], foundProduct._doc.customizations.sizes.map(size => size.value));
            let validSugarLevel = validValues([argSugarLevel], foundProduct._doc.customizations.sugarLevels);
            let validIceLevel = validValues([argIceLevel], foundProduct._doc.customizations.iceLevels);
            let validToppings = validValues(argToppings, foundProduct._doc.toppings);

            if(!validSize || !validSugarLevel || !validIceLevel || !validToppings) {
                throw new Error(ErrorTypes.INVALID_CUSTOMIZATION_OR_TOPPING);
            }

            // Create order item
            let orderItemData = { 
                order: argOrderId,
                product: argProductId,
                quantity: argQuantity,
                customizations: {
                    size: argSize,
                    sugarLevel: argSugarLevel,
                    iceLevel: argIceLevel
                },
                toppings: argToppings
            }

            const orderItem = new OrderItem({ ...orderItemData }).toObject();
            delete orderItem._id; // delete mongo _id

            // Create mongoose query from orderItemData
            // Query will find order items that exactly match order, product, customizations, and toppings
            let { quantity, ...query } = orderItemData;

            // Upsert order item into db with given query
            let upsertedOrderItem = await OrderItem.findOneAndUpdate(query, orderItem, { upsert: true, new: true });

            // Update related order document
            // Push to its list of order items
            let alreadyInOrder = foundOrder.items.find(id => id.equals(upsertedOrderItem._id));
            if(!alreadyInOrder) {
                foundOrder.items.push(upsertedOrderItem);
            }

            // Save related order document
            await foundOrder.save();

            // Calculate order total
            foundOrder.total = await calculateOrderTotal(foundOrder._doc._id);

            // Resave related order document
            await foundOrder.save();
            
            // Return created order item's information
            return {
                ...upsertedOrderItem._doc,
                product: nestProduct.bind(this, upsertedOrderItem._doc.product),
                order: nestOrder.bind(this, upsertedOrderItem._doc.order),
                toppings: nestToppings.bind(this, upsertedOrderItem._doc.toppings)
            };

        } catch(e) {
            throw e;
        }
    },
    deleteOrderItem: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }

            // Extract arguments
            var argOrderItemId = args.deleteOrderItemInput.orderItemId;
            
            // Find order item
            let foundOrderItem = await OrderItem.findById(argOrderItemId);
            if(!foundOrderItem) {
                throw new Error(ErrorTypes.ORDER_ITEM_DNE);
            }
    
            var orderId = foundOrderItem._doc.order;
            
            // Ensure order created by authenticated user
            let orderDoc = await Order.findOne({ _id: orderId, creator: req.userId });
            if(!orderDoc) {
                throw new Error(ErrorTypes.ORDER_ITEM_DNE);
            }
        
            // Ensure order not already finalized
            let alreadyFinalized = await FinalizedOrder.findOne({ order: orderId });
            if(alreadyFinalized) {
                throw new Error(ErrorTypes.ALREADY_FINALIZED);
            }
                        
            // Update order doc
            // Update order's list of items
            orderDoc.items = orderDoc.items.filter(id => !id.equals(foundOrderItem._id));

            // Save order
            await orderDoc.save();

            // Update orders total
            orderDoc.total = await calculateOrderTotal(orderDoc._doc._id);

            // Resave order
            await orderDoc.save();
            
            // Delete order item
            await foundOrderItem.remove();

            return {
                message: `Deleted item` 
            };
        } catch (e) {
            throw e;
        }      
    },
    orderItem: async (args, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }

            // Extract arguments
            var argOrderItemId = args.queryOrderItemInput.orderItemId;
    
            // Find orders created by user with specified order item id in its array
            let foundOrder = await Order.findOne({ creator: req.userId, items: { $in: [argOrderItemId] } })
            if(!foundOrder) {
                throw new Error(ErrorTypes.ORDER_ITEM_DNE);
            }
            
            // Get specified order item
            let foundOrderItem = await OrderItem.findById(argOrderItemId)
            if(!foundOrderItem) {
                throw new Error(ErrorTypes.ORDER_ITEM_DNE);
            }

            return {
                ...foundOrderItem._doc,
                product: nestProduct.bind(this, foundOrderItem._doc.product),
                order: nestOrder.bind(this, foundOrderItem._doc.order)
            };                
        } catch(e) {
            throw e;
        }
    }
}
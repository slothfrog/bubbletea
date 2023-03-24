// Helpers functions that perform calculations

const Order = require("../models/order");
const OrderItem = require('../models/orderItem');
const { TAX_RATE } = require('../utils/constant');

const calculateOrderTotal = async (orderId) => {

    let ret = 0;
    let foundOrder = await Order.findById(orderId);

    if(foundOrder) {
        // Calculate order total
        let orderItems = await Promise.all(foundOrder.items.map((orderItemId) => OrderItem.findById(orderItemId).populate('product', 'customizations').populate('toppings', 'price')));

        let total = orderItems.map(orderItem => {
            let toppingsPrice = orderItem.toppings.reduce((val, curTopping) => val + curTopping.price, 0);

            let drinkSizePrice = orderItem.product.customizations.sizes.find((size) => size.value === orderItem.customizations.size).price;

            let basePrice = parseFloat(((toppingsPrice + drinkSizePrice) * TAX_RATE).toFixed(2));

            return parseFloat((basePrice * orderItem.quantity).toFixed(2));
        }).reduce((val, itemPrice) => val + itemPrice, 0).toFixed(2);

        ret = total;
    }

    return ret;
};



exports.calculateOrderTotal = calculateOrderTotal;
// Exports root resolver to app.js

const ordersResolvers = require('./orders');
const usersResolvers = require('./users');
const productsResolvers = require('./products');
const orderItemsResolvers = require('./orderItems');
const finalizedOrdersResolvers = require('./finalizedOrders');
const toppingsResolvers = require('./toppings');
const categoriesResolvers = require('./categories');
const locationsResolvers = require('./locations');

const rootResolver = {
    ...ordersResolvers,
    ...usersResolvers,
    ...productsResolvers,
    ...orderItemsResolvers,
    ...finalizedOrdersResolvers,
    ...toppingsResolvers,
    ...categoriesResolvers,
    ...locationsResolvers
};

module.exports = rootResolver;
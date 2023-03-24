// Exports helper functions to help resolvers nest documents into others

const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Topping = require('../models/topping');
const Category = require('../models/category');
const Payment = require('../models/payment');
const Upload = require('../models/upload');
const Location = require('../models/location');


const nestUser = (userId) => {
    return User.findById(userId).then((data) => {
        return { 
            ...data._doc, 
            password: null,  
            createdAt: new Date(data._doc.createdAt).toISOString() 
        };
    }).catch((err) => {
        throw err;
    });
};

const nestProduct = (productId) => {
    return Product.findById(productId).then((data) => {
        let dataCopy = { ...data._doc };
        delete dataCopy.upload;

        return {
            ...dataCopy,
            hasImage: uploadExists.bind(this, data._doc.upload),
            toppings: nestToppings.bind(this, data._doc.toppings),
            category: nestCategory.bind(this, data._doc.category)
        };
    }).catch((err) => {
        throw err;
    });
};

const nestOrder = (orderId) => {
    return Order.findById(orderId).then((data) => {
        return {
            ...data._doc,
            creator: nestUser.bind(this, data._doc.creator),
            items: nestOrderItems(data._doc.items)
        };
    }).catch((err) => {
        throw err;
    })
};

const nestOrderItems = (orderItemIds) => {
    return OrderItem.find({_id: { $in: orderItemIds }}).then((orderItems) => {
        return orderItems.map((orderItem) => {
            return {
                ...orderItem._doc,
                order: nestOrder.bind(this, orderItem._doc.order),
                product: nestProduct.bind(this, orderItem._doc.product),
                toppings: nestToppings.bind(this, orderItem._doc.toppings)
            };
        });
    }).catch((err) => {
        throw err;
    })
};

const nestToppings = (toppingIds) => {
    return Topping.find({_id: { $in: toppingIds }}).then((toppings) => {
        return toppings.map((topping) => {
            return {
                ...topping._doc
            };
        });
    }).catch((err) => {
        throw err;
    })
};

const nestCategory = (categoryId) => {
    return Category.findById(categoryId).then((data) => {
        return { 
            ...data._doc
        };
    }).catch((err) => {
        throw err;
    });
};

const nestPayment = (paymentId) => {
    return Payment.findById(paymentId).then((data) => {
        return { 
            ...data._doc,
            order: nestOrder.bind(this, data._doc.order)
        };
    }).catch((err) => {
        throw err;
    });
};

const nestLocation = (locationId) => {
    return Location.findById(locationId).then((data) => {
        return { 
            ...data._doc,
        };
    }).catch((err) => {
        throw err;
    });
};

const uploadExists = (id) => {
    return Upload.findById(id).then((data) => {
        return (data._doc && true) || false;
    }).catch((err) => {
        return false;
    });
}

exports.nestUser = nestUser;
exports.nestProduct = nestProduct;
exports.nestOrder = nestOrder;
exports.nestOrderItems = nestOrderItems;
exports.nestToppings = nestToppings;
exports.nestCategory = nestCategory;
exports.nestPayment = nestPayment;
exports.nestLocation = nestLocation;
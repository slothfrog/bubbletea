const mongoose = require('mongoose');
const IceLevels = require('../enums/IceLevels');
const Sizes = require('../enums/Sizes');
const SugarLevels = require('../enums/SugarLevels');

const Schema = mongoose.Schema;

const orderItemSchema = new Schema(
    {
        order: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Order'
        },
        product: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        customizations: {
            size: {
                type: String,
                enum: Sizes,
                required: true
            },
            sugarLevel: {
                type: Number,
                enum: SugarLevels,
                required: true
            },
            iceLevel: {
                type: String,
                enum: IceLevels,
                required: true
            }
        },
        toppings: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Topping'
            }
        ]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
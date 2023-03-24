const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const finalizedOrderSchema = new Schema(
    {
        order: {
            type: mongoose.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'Order'
        },
        payment: {
            type: mongoose.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'Payment'
        },
        location: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Location'
        },
        finalizedDate: {
            type: Date,
            required: true
        },
        readyDate: {
            type: Date,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('FinalizedOrder', finalizedOrderSchema);
finalizedOrderSchema.plugin(uniqueValidator);
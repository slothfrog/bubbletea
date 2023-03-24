const mongoose = require('mongoose');
const PaymentMethods = require('../enums/PaymentMethods');
const PaymentStatus = require('../enums/PaymentStatus');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        order: {
            type: mongoose.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'Order'
        },
        status: {
            type: String,
            enum: PaymentStatus,
            required: true,
            default: PaymentStatus.unpaid
        },
        externalPaymentId: {
            type: String,
            unique: true,
            sparse: true
        },
        paymentMethod: {
            type: String,
            enum: PaymentMethods,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Payment', paymentSchema);
paymentSchema.plugin(uniqueValidator);
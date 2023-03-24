const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        creator: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        items: [
            {
                type: Schema.Types.ObjectId,
                ref: 'OrderItem'
            }
        ],
        total: {
            type: Number,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Order', orderSchema);
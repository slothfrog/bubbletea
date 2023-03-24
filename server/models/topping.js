const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const toppingSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Topping', toppingSchema);
toppingSchema.plugin(uniqueValidator);
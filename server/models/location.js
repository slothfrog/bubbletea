const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const locationSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        position: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        },
        phone: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Location', locationSchema);
locationSchema.plugin(uniqueValidator);
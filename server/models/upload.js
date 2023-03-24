const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const uploadSchema = new Schema(
    {
        ref: {
            type: String,
            required: true,
            unique: true
        },
        filename: {
            type: String,
            required: true,
            unique: true
        },
        mimetype: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Upload', uploadSchema);
uploadSchema.plugin(uniqueValidator);
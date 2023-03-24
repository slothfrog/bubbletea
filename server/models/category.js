const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Category', categorySchema);
categorySchema.plugin(uniqueValidator);
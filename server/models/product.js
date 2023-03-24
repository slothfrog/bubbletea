const mongoose = require('mongoose');
const IceLevels = require('../enums/IceLevels');
const Sizes = require('../enums/Sizes');
const SugarLevels = require('../enums/SugarLevels');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        customizations: {
            sizes: [
                {
                    _id: false,
                    value: {
                        type: String,
                        enum: Sizes,
                        required: true
                    },
                    price: {
                        type: Number,
                        required: true
                    }
                }
            ],
            sugarLevels: [
                {
                    type: Number,
                    enum: SugarLevels,
                    required: true
                }
            ],
            iceLevels: [
                {
                    type: String,
                    enum: IceLevels,
                    required: true
                }
            ]
        },
        toppings: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Topping',
            }
        ],
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Topping',
            required: true
        },
        upload: {
            type: Schema.Types.ObjectId,
            ref: 'Upload'
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Product', productSchema);
productSchema.plugin(uniqueValidator);

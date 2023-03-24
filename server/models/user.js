const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const UserRoles = require('../enums/UserRoles');
const UserTypes = require('../enums/UserTypes');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: this.type === UserTypes.internal
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            enum: UserTypes,
            default: UserTypes.internal,
            required: true
        },
        role: {
            type: String,
            enum: UserRoles,
            default: UserRoles.customer,
            required: true
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('User', userSchema);
userSchema.plugin(uniqueValidator);
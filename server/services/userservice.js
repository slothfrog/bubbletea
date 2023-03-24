// Service methods for users
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const UserTypes = require('../enums/UserTypes');
const UserRoles = require('../enums/UserRoles');

module.exports = {
    createUser: async (email, password, name, role = UserRoles.customer, type = UserTypes.internal) => {
        let hash = await bcrypt.hash(password, 12);

        let userExists = await User.findOne({});
        if(!userExists) {
            role = UserRoles.staff;
        }

        let newUser = {
            name: name,
            email: email,
            password: (type === UserTypes.internal) ? hash : undefined,
            type: type,
            role: role,
            createdAt: new Date()
        }

        const user = new User(newUser);

        return await user.save();
    },
    userExists: async (email) => {
        let userAlreadyExists = await User.findOne({ email: email });
        return (userAlreadyExists && true) || false;
    }
}
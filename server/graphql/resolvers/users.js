// Exports resolvers related to users / auth

const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const { ErrorTypes } = require('../../utils/error');
const { nestUser } = require('../../helpers/nestDocument');
const UserService = require('../../services/userservice');

module.exports = {
    user: async (_, req) => {
        try {
            if(!req.isAuth) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }

            // Return information of current authenticated user
            return nestUser(req.userId);
        } catch(e) {
            throw e;
        }
    },
    createUser: async (args) => {
        try {
            // Extract arguments
            var argEmail = args.createUserInput.email;
            var argPassword = args.createUserInput.password;
            var argName = args.createUserInput.name;
    
            if(await UserService.userExists(argEmail)) {
                throw new Error(ErrorTypes.USER_EXISTS);
            }

            let result = await UserService.createUser(argEmail, argPassword, argName);
            return nestUser(result._id);

        } catch(e) {
            throw e;
        }
    },
    login: async (args, req) => {
        try {
            // Extract arguments
            var argEmail = args.loginInput.email;
            var argPassword = args.loginInput.password;
    
            // Check if email exists
            let data = await User.findOne({ email: argEmail });
            if(!data) {
                throw new Error(ErrorTypes.INVALID_LOGIN);
            }
    
            // Compare hashes
            let isEqual = await bcrypt.compare(argPassword, data.password)
            if(!isEqual) {
                throw new Error(ErrorTypes.INVALID_LOGIN);
            }

            // new session
            req.session.userId = data._id;

            return nestUser(data._doc._id);
        } catch(e) {
            throw e;
        }
    },
    logout: (_, req) => {
        req.session.userId = undefined;

        return { message: "Logged out" };
    }
}
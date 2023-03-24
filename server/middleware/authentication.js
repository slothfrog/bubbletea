// Exports authentication related express-middleware

const UserRoles = require('../enums/UserRoles');
const User = require('../models/user');

module.exports = {
    setAuthenticated: (req, res, next) => {    
        req.isAuth = (req.session.userId && true) || false;
        if(req.isAuth) req.userId = req.session.userId;

        next();
    },
    setIsStaff: async (req, res, next) => {
        if(req.isAuth) {
            let foundUser = await User.findById(req.userId);

            if(foundUser) {
                req.isStaff = foundUser.role === UserRoles.staff;
            }
        }
        
        next();
    }
};
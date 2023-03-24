// Exports resolvers related to toppings

const { PAGE_SIZE } = require('../../utils/constant');
const Topping = require('../../models/topping');
const { ErrorTypes } = require('../../utils/error');

module.exports = {
    toppings: async (args) => {
        try {
            // Extract arguments
            var argPage = args.queryPageInput.page;

            // Return toppings
            let data = await Topping.find().skip(argPage * PAGE_SIZE).limit(PAGE_SIZE);
            return data.map((topping) => {
                return {
                    ...topping._doc
                };
            });
        } catch(e) {
            throw e;
        }
    },
    createTopping: async (args, req) => {
        try {
            if(!req.isStaff) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }
            
            // Extract arguments
            var argName = args.createToppingInput.name;
            var argPrice = args.createToppingInput.price;
    
            // Construct topping
            const topping = new Topping({
                name: argName,
                price: argPrice
            });
    
            // Save and return topping
            let result = await topping.save()
            return {
                ...result._doc
            };
        } catch(e) {
            throw e;
        }
    }
}
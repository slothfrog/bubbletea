// Exports resolvers related to products

const { PAGE_SIZE } = require('../../utils/constant');
const Product = require('../../models/product');
const { validValuesNoDuplicates } = require('../../helpers/validators');
const Sizes = require('../../enums/Sizes');
const IceLevels = require('../../enums/IceLevels');
const SugarLevels = require('../../enums/SugarLevels');
const Topping = require('../../models/topping');
const { nestToppings, nestProduct } = require('../../helpers/nestDocument');
const Category = require('../../models/category');
const { ErrorTypes } = require('../../utils/error');

module.exports = {
    products: async (args) => {
        try {
            // Extract args
            var argPage = args.queryProductInput.page;
            var argCategory = args.queryProductInput.category;
            
            // Query for category if it exists
            let query = (argCategory != "" && argCategory != undefined) ? { category: argCategory } : {};
            let data = await Product.find(query).skip(argPage * PAGE_SIZE).limit(PAGE_SIZE).exec();
            return data.map((product) => {
                return nestProduct(product._doc._id);
            });
        } catch(e) {
            throw e;
        }
    },
    createProduct: async (args, req) => {
        try {
            if(!req.isStaff) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }
            
            // Extract arguments
            var argName = args.createProductInput.name;
            var argCustomizations = args.createProductInput.customizations;
            var argToppings = args.createProductInput.toppings;
            var argCategory = args.createProductInput.category;
    
            // Ensure customizations are valid
            var validSizes = validValuesNoDuplicates(argCustomizations.sizes.map(size => size.value), Object.values(Sizes));
            var validSugarLevels = validValuesNoDuplicates(argCustomizations.sugarLevels, Object.values(SugarLevels));
            var validIceLevels = validValuesNoDuplicates(argCustomizations.iceLevels, Object.values(IceLevels));
    
            if(!validSizes || !validSugarLevels || !validIceLevels) {
                throw new Error(ErrorTypes.INVALID_CUSTOMIZATION);
            }
    
            // Ensure all toppings exist
            let foundToppings = await Topping.find({_id: { $in: argToppings }});
            if(foundToppings.length != argToppings.length) {
                throw new Error(ErrorTypes.TOPPING_DNE);
            }

            // Ensure category exists
            let foundCategory = await Category.findById(argCategory);
            if(!foundCategory) {
                throw new Error(ErrorTypes.CATEGORY_DNE);
            }

            // Construct product
            const product = new Product({
                name: argName,
                customizations: {
                    sizes: argCustomizations.sizes,
                    iceLevels: argCustomizations.iceLevels,
                    sugarLevels: argCustomizations.sugarLevels
                },
                toppings: argToppings,
                category: argCategory
            });

            let result = await product.save();
            return nestProduct(result._doc._id);
        } catch(e) {
            throw e;
        }
    }
}
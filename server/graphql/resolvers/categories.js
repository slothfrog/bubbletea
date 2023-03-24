// Exports resolvers related to products

const { PAGE_SIZE } = require('../../utils/constant');
const Category = require('../../models/category');
const { ErrorTypes } = require('../../utils/error');

module.exports = {
    categories: async (args) => {
        try {
            // Extract args
            var argPage = args.queryPageInput.page;

            let data = await Category.find().skip(argPage * PAGE_SIZE).limit(PAGE_SIZE).exec();
            return data.map((category) => {
                return {
                    ...category._doc
                };
            });
        } catch(e) {
            throw e;
        }
    },
    createCategory: async (args, req) => {
        try {
            if(!req.isStaff) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }
            
            // Extract arguments
            var argName = args.createCategoryInput.name;

            if(argName == "") {
                throw new Error(ErrorTypes.CATEGORY_EMPTY);
            }

            // Construct product
            const category = new Category({
                name: argName
            });
    
            let result = await category.save();
            return { 
                ...result._doc
            };
        } catch(e) {
            throw e;
        }
    }
}
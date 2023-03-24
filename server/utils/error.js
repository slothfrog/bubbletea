exports.ErrorTypes = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    CATEGORY_EMPTY: 'CATEGORY_EMPTY',
    NAME_EMPTY: 'NAME_EMPTY',
    ADDRESS_EMPTY: 'ADDRESS_EMPTY',
    FINALIZED_ORDER_DNE: 'FINALIZED_ORDER_DNE',
    ORDER_DNE: 'ORDER_DNE',
    PRODUCT_DNE: 'PRODUCT_DNE',
    TOPPING_DNE: 'TOPPING_DNE',
    ORDER_ITEM_DNE: 'ORDER_ITEM_DNE',
    CATEGORY_DNE: 'CATEGORY_DNE',
    INVALID_CUSTOMIZATION: 'INVALID_CUSTOMIZATION',
    INVALID_QUANTITY: 'INVALID_QUANTITY',
    INVALID_CUSTOMIZATION_OR_TOPPING: 'INVALID_CUSTOMIZATION_OR_TOPPING',
    INVALID_LOGIN: 'INVALID_LOGIN',
    ALREADY_FINALIZED: 'ALREADY_FINALIZED',
    USER_EXISTS: 'USER_EXISTS',
    MISSING_FIELDS: 'MISSING_FIELDS',
    INVALID_ID: 'INVALID_ID',
    UPLOAD_DNE: 'UPLOAD_DNE'
};

exports.ErrorData = {
    UNAUTHORIZED: {
        message: "Unauthenticated",
        statusCode: 401
    },
    CATEGORY_EMPTY: {
        message: "Category name cannot be empty",
        statusCode: 400
    },
    NAME_EMPTY: {
        message: "Name cannot be empty",
        statusCode: 400
    },
    ADDRESS_EMPTY: {
        message: "Address cannot be empty",
        statusCode: 400
    },
    FINALIZED_ORDER_DNE: {
        message: "Finalized order doesn't exist",
        statusCode: 404
    },
    ORDER_DNE: {
        message: "Order doesn't exist",
        statusCode: 404
    },
    PRODUCT_DNE: {
        message: "Product doesn't exist",
        statusCode: 404
    },
    TOPPING_DNE: {
        message: "Topping doesn't exist",
        statusCode: 404
    },
    ORDER_ITEM_DNE: {
        message: "Order Item doesn't exist",
        statusCode: 404
    },
    CATEGORY_DNE: {
        message: "Category doesn't exist",
        statusCode: 404
    },
    UPLOAD_DNE: {
        message: "Uploaded resource doesn't exist",
        statusCode: 404
    },
    INVALID_CUSTOMIZATION: {
        message: "Invalid customizations",
        statusCode: 400
    },
    INVALID_CUSTOMIZATION_OR_TOPPING: {
        message: "Invalid customizations / toppings",
        statusCode: 400
    },
    INVALID_QUANTITY: {
        message: "Invalid quantity",
        statusCode: 400
    },
    INVALID_LOGIN: {
        message: "Invalid Login",
        statusCode: 401
    },
    USER_EXISTS: {
        message: "Email already registered",
        statusCode: 409
    },
    ALREADY_FINALIZED: {
        message: "Order already finalized",
        statusCode: 409
    },
    MISSING_FIELDS: {
        message: (...fields) => fields.reduce((prev, cur) => `${prev} ${cur},`, "There are missing fields in the body: ").slice(0, -1),
        statusCode: 400
    },
    INVALID_ID: {
        message: "id given is invalid ObjectId",
        statusCode: 400
    }
};
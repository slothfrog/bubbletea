const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        role: String!
        createdAt: String!
    }

    type Order {
        _id: ID!
        creator: User!
        items: [OrderItem!]
        total: Float!
    }

    type FinalizedOrder {
        _id: ID!
        order: Order!
        finalizedDate: String!
        readyDate: String!
        location: Location!
        payment: Payment!
    }

    type Payment {
        _id: ID!
        status: String!
        paymentMethod: String
        externalPaymentId: String
    }

    type Product {
        _id: ID!
        name: String!
        customizations: Customization!
        toppings: [Topping!]
        category: Category!
        hasImage: Boolean!
    }

    type Topping {
        _id: ID!
        name: String!
        price: Float!
    }

    type Customization {
        sizes: [Size!]!
        sugarLevels: [Int!]!
        iceLevels: [String!]!
    }

    type Size {
        value: String!
        price: Float!
    }

    type OrderItem {
        _id: ID!
        order: Order!
        product: Product!
        quantity: Int!
        customizations: OrderItemCustomization!
        toppings: [Topping!]
    }

    type Location {
        _id: ID!
        name: String!
        address: String!
        position: Position!
        phone: String!
    }

    type Position {
        lat: Float!
        lng: Float!
    }

    type OrderItemCustomization {
        size: String!
        sugarLevel: Int!
        iceLevel: String!
    }

    type Category {
        _id: ID!
        name: String!
    }

    type MutationMessage {
        message: String!
    }

    type QueryMessage {
        message: String!
    }

    input CreateUserInput {
        name: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input CreateProductInput {
        name: String!
        toppings: [ID!]!
        customizations: CustomizationInput!
        category: String!
    }

    input CustomizationInput {
        sizes: [SizeInput!]!
        sugarLevels: [Int!]!
        iceLevels: [String!]!
    }

    input SizeInput {
        value: String!
        price: Float!
    }

    input DeleteOrderItemInput {
        orderItemId: ID!
    }

    input CreateToppingInput {
        name: String!
        price: Float!
    }

    input CreateOrderItemInput {
        orderId: ID!
        productId: ID!
        quantity: Int!
        size: String!
        iceLevel: String!
        sugarLevel: Int!
        toppings: [ID!]
    }

    input QueryOrderItemInput {
        orderItemId: ID!
    }

    input FinalizeOrderInput {
        orderId: ID!
        paymentId: ID!
    }

    input CreateCategoryInput {
        name: String!
    }
    
    input CreateLocationInput {
        name: String!
        address: String!
        phone: String!
        lat: Float!
        lng: Float!
    }

    input QueryFinalizedOrderInput {
        orderId: ID!
    }
    
    input QueryLocationInput {
        locationId: ID!
    }

    input QueryProductInput {
        category: ID
        page: Int!
    }

    input QueryOrderInput {
        orderId: ID!
    }

    input QueryPageInput {
        page: Int!
    }
    
    type RootQuery {
        user: User!
        logout: QueryMessage!
        orders(queryPageInput: QueryPageInput): [Order!]!
        order(queryOrderInput: QueryOrderInput): Order!
        locations(queryPageInput: QueryPageInput): [Location!]!
        location(queryLocationInput: QueryLocationInput): Location!
        products(queryProductInput: QueryProductInput): [Product!]!
        toppings(queryPageInput: QueryPageInput): [Topping!]!
        orderItem(queryOrderItemInput: QueryOrderItemInput): OrderItem
        finalizedOrders(queryPageInput: QueryPageInput): [FinalizedOrder!]!
        finalizedOrder(queryFinalizedOrderInput: QueryFinalizedOrderInput): FinalizedOrder!
        categories(queryPageInput: QueryPageInput): [Category!]!
    }

    type RootMutation {
        createUser(createUserInput: CreateUserInput): User
        createOrder: Order
        login(loginInput: LoginInput): User!
        createLocation(createLocationInput: CreateLocationInput): Location!
        createProduct(createProductInput: CreateProductInput): Product
        createOrderItem(createOrderItemInput: CreateOrderItemInput): OrderItem
        deleteOrderItem(deleteOrderItemInput: DeleteOrderItemInput): MutationMessage
        createTopping(createToppingInput: CreateToppingInput): Topping
        createCategory(createCategoryInput: CreateCategoryInput): Category
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
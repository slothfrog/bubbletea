## GraphQL API

### Return type definitions

```graphql
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
```

### Input type definitions

```graphql
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
```

### Query definitions
```graphql  
To get current authenticated user
user: User!

To logout of current user
logout: QueryMessage!

To get current users active orders
orders(queryPageInput: QueryPageInput): [Order!]!

To get specified active order
order(queryOrderInput: QueryOrderInput): Order!

To get store locations
locations(queryPageInput: QueryPageInput): [Location!]!

To get specified store location
location(queryLocationInput: QueryLocationInput): Location!

To get products
products(queryProductInput: QueryProductInput): [Product!]!

To get product toppings
toppings(queryPageInput: QueryPageInput): [Topping!]!

To get specific order item
orderItem(queryOrderItemInput: QueryOrderItemInput): OrderItem

To get finalized orders
finalizedOrders(queryPageInput: QueryPageInput): [FinalizedOrder!]!

To get specific finalized order
finalizedOrder(queryFinalizedOrderInput: QueryFinalizedOrderInput): FinalizedOrder!

To get product categories
categories(queryPageInput: QueryPageInput): [Category!]!
```

### Mutation definitions
```graphql

To create user
createUser(createUserInput: CreateUserInput): User

To create order
createOrder: Order

To login
login(loginInput: LoginInput): User!

To create a location
createLocation(createLocationInput: CreateLocationInput): Location!

To create a product
createProduct(createProductInput: CreateProductInput): Product

To create an order item
createOrderItem(createOrderItemInput: CreateOrderItemInput): OrderItem

To delete an order item
deleteOrderItem(deleteOrderItemInput: DeleteOrderItemInput): MutationMessage

To create a topping
createTopping(createToppingInput: CreateToppingInput): Topping

To create a category
createCategory(createCategoryInput: CreateCategoryInput): Category
```

Note: Some resolvers can only be done when authorized as a staff user (eg: createTopping, createProduct).


### How to use

```graphql
mutation {
    createUser(
        createUserInput: {
            name: "name", 
            email: "test@test.com",
            password: "pwpw"
        }
    ) {
        _id
        name
        email
        password
        createdAt
        role
    }
}

mutation {
    login(
        loginInput: {
            email: "test@test.com", 
            password: "pwpw"
        }
    
    ) {
        email
    }
}

query {
    logout {
        message  
    }
}

query {
    orderItem(
        queryOrderItemInput: {
            orderItemId: "000000000000000000000000"
        }
    ) {
        _id
        quantity
        product {
            name
            category {
                name
            }
        }
        order {
            _id
            creator {
                name
                email
            }
        }
    }
}

query {
    finalizedOrders(
        queryPageInput: {
            page: 0
        }
    ) {
        order {
            _id
            total
            creator {
                name
            }
        }
        _id
        payment {
            status
            paymentMethod
            externalPaymentId
            _id
        }
        finalizedDate
    }
}

query {
    finalizedOrder(
        queryFinalizedOrderInput: {
            orderId: "000000000000000000000000"
        }
    ) {
        _id
        order {
            creator {
                name
            }
            items {
                _id
                product {
                    name
                }
                toppings {
                    name
                }
                customizations {
                    iceLevel
                    size
                    sugarLevel
                }
            }
        }
        location {
            name
            _id
            address
            position {
                lat
                lng
            }
            phone
        }
    }
}

query {
    user {
        _id
        password
        createdAt
        name
        email
        role
    }
}

query {
    orders(
        queryPageInput: {
            page: 0
        }
    ) {
        _id
        creator {
            name
        }
        total
        items {
            _id
            toppings {
                name
            }
            customizations {
                size

            }
            product {
                name
                customizations {
                    sizes {
                        value
                        price
                    }
                }
            }
        }
    }
}

query {
    products(
        queryProductInput: {
            page: 0,
            category: ""
        }
    ) {
        _id
        name
        category {
            name
        }
        customizations {
            iceLevels
            sizes {
                value
                price
            }
            sugarLevels
        }
        toppings {
            name
        }
        hasImage
    }
}

query {
    order(queryOrderInput: {
        orderId: "000000000000000000000000"
        }
    ) {
        creator {
            name
        }
        _id
        items {
            product {
                name
            }
        }
    }
}

query {
    categories(
        queryPageInput: {
            page: 0
        }
    ) {
        _id
        name
    }
}

query {
    location(
        queryLocationInput: {
            locationId: ""
        }
    ) {
        _id
        name
        address
    }
}

query {
    locations(
        queryPageInput: {
            page: 0
        }
    ) {
        _id
        name
        address
        phone
        position {
            lat
            lng
        }
    }
}

query {
    toppings(
        queryPageInput: { 
            page: 0
        }
    ) {
        name
        _id
        price
    }
}

mutation {
    createOrder {
        _id
        creator {
            name
            email
            password
        }
    }
}

mutation {
    createProduct (
        createProductInput: {
            name: "Boba Milk Black Tea THE BEST", 
            toppings: ["000000000000000000000000"],
            category: "000000000000000000000001",
            customizations: {
                sizes: [
                    {
                        value: "small",
                        price: 6.99
                    },
                    {
                        value: "medium",
                        price: 7.99
                    }
                ],
                sugarLevels: [0,25,50, 75],
                iceLevels: ["no", "more", "normal"]
            }
        }
    ) {
        _id
        name
        category {
            name
        }
        customizations {
            iceLevels
            sizes {
                value
                price
            }
            sugarLevels
        }
        toppings {
            name
        }
    }
}

mutation {
    createOrderItem(
        createOrderItemInput: { 
            quantity: 4, 
            orderId: "000000000000000000000000", 
            productId: "000000000000000000000001",
            size: "small",
            iceLevel: "no",
            sugarLevel: 0
        }
    ) {
        _id
        quantity
        product {
            name
            customizations {
                sizes {
                    value
                    price
                }
            }
        }
        order {
            creator {
                name
            }
            items {
                _id
            }
        }
    }
}

mutation{
    deleteOrderItem(
        deleteOrderItemInput: {
            orderItemId: "000000000000000000000000"
        }
    ) {
        message
    }
}

mutation {
    createTopping(
        createToppingInput: {
            name: "Green Jelly",
            price: 9.99
        }
    ) {
        _id
    }
}

mutation {
    createCategory(
        createCategoryInput: {
            name: "Black Tea"
        }
    ) {
        name
        _id
    }
}

mutation {
    createLocation(
        createLocationInput: {
            name: "Pepes Bubbles @ Yonge and Finch2",
            address: "5594 Yonge Street",
            phone: "34233243",
            lat: 32.432423,
            lng: 22.321322
        }
    ) {
        _id,
        name,
        address,
        position {
            lat
            lng
        }
    }
}
```
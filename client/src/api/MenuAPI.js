import {gql} from 'graphql-tag';

export const getProducts = gql`
    query getProducts($category: ID!){
        products(
            queryProductInput: {
                page: 0,
                category: $category
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
                _id
                name
                price
            }
            hasImage
        }
    }
`;

export const getToppings = gql`
    query {
        toppings(queryPageInput: { page: 0 }) {
            name
            _id
            price
        }
    }
`

export const getCategories = gql `
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
`

export const addOrderItem = gql `
mutation addOrderItem(
    $quantity: Int!, 
    $orderId: ID!, 
    $productId: ID!, 
    $size: String!, 
    $ice: String!,
    $sugar: Int!,
    $toppings: [ID!]){
        createOrderItem(
            createOrderItemInput: { 
                quantity: $quantity, 
                orderId: $orderId, 
                productId: $productId,
                size: $size,
                iceLevel: $ice,
                sugarLevel: $sugar,
                toppings: $toppings
            }
        ) {
            _id
            quantity
            product {
                _id
                name
                customizations {
                    sizes {
                        value
                        price
                    }
                }
            }
            order {
                _id
                creator {
                    name
                }
                items {
                    _id
                }
            }
        }
}`

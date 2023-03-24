import {gql} from 'graphql-tag';
export const getOrders = gql`
query {
    orders(
        queryPageInput: {
            page: 0
        }
        ) {
            _id
            creator {
                name
                email
            }
            items {
                _id
                customizations {
                    size
                    sugarLevel
                    iceLevel
                }
                product {
                    _id
                    hasImage
                    name
                    customizations {
                        sizes {
                            value
                            price
                        }
                    }
                }
                quantity
                toppings {
                    _id
                    name
                    price
                }
            }
        }
    }
`;

export const createOrder = gql`
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
`


export const modifyOrderItem = gql`
    mutation ModifyOrderItem($orderId: ID!, $quantity: Int!, $productId: ID!, $size: String!, $iceLevel: String!, $sugarLevel: Int!, $toppings: [ID!]){
        createOrderItem(
            createOrderItemInput: { 
                quantity: $quantity, 
                orderId: $orderId, 
                productId: $productId,
                size: $size,
                iceLevel: $iceLevel,
                sugarLevel: $sugarLevel
                toppings: $toppings
            }
        ) {
            _id
            quantity
        }
    }
`

export const deleteOrderItem = gql`
    mutation DeleteOrderItem($orderItemId: ID!){
        deleteOrderItem(
            deleteOrderItemInput: {
                orderItemId: $orderItemId
            }
        ) {
            message
        }
    }
`

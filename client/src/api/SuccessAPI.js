import {gql} from 'graphql-tag';

export const getFinalizedOrder = gql`
    query GetFinalizedOrder($orderId: ID!){
        finalizedOrder(
            queryFinalizedOrderInput: { 
                orderId: $orderId
            }
        ) {
            _id
            readyDate
            location {
                _id
                name
            }
        }
    }
`

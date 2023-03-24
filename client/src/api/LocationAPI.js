import {gql} from 'graphql-tag';

export const getLocations = gql`
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
`
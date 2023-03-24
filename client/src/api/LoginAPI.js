import {gql} from 'graphql-tag';

export const createUser = gql`
mutation createUser($name: String!, $email: String!, $password: String!){
    createUser(
        createUserInput: {
            name: $name, 
            email: $email,
            password: $password
        }
    ) {
        _id
        name
        email
        password
        createdAt
    }
}`;

export const signInUser = gql`
mutation signInUser($email: String!, $password: String!){
    login(
        loginInput: {
            email: $email,
            password: $password
        }
    
    ) {
        _id
    }
}`

export const getIsAuthenticated = gql`
    query {
        user {
            _id
            password
            createdAt
            name
            email
        }
    }
`

export const logoutUser = gql`
    query {
        logout {
            message
        }
    }
`
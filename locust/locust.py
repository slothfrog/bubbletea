import time
from locust import HttpUser, task, between


class PepesbubblesUser(HttpUser):
    wait_time = between(1, 5)

    # def on_start(self):
    #     query = '''
    #     mutation {
    #         createUser(
    #             createUserInput: {
    #                 name: "locust", 
    #                 email: "locust@test.com",
    #                 password: "pw"
    #             }
    #         ) {
    #             _id
    #             name
    #             email
    #             password
    #             createdAt
    #             role
    #         }
    #     }
    #     '''
    #     response = self.client.post(name="create_user",
    #         url="http://localhost:5000/graphql",
    #         json={"query": query}
    #     )

    #     query = '''
    #     mutation {
    #         login(
    #             loginInput: {
    #                 email: "locust@test.com", 
    #                 password: "pw"
    #             }
            
    #         ) {
    #             userId
    #         }
    #     }
    #     '''
    #     response = self.client.post(name="login_user",
    #         url="http://localhost:5000/graphql",
    #         json={"query": query}
    #     )

    # todo set cookies for authentication for future requests

    @task
    def get_products(self):
        query = '''
        query {
            products(
                queryProductInput: {
                    page: 0,
                    category: ""
                }
            ){
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
        
        '''
        self.client.post(name="get_products",
            url="http://localhost:5000/graphql",
            json={"query": query}
        )

    @task
    def get_toppings(self):
        query = '''
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
        
        '''
        self.client.post(name="get_toppings",
            url="http://localhost:5000/graphql",
            json={"query": query}
        )

    @task
    def get_categories(self):
        query = '''
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
        '''
        self.client.post(name="get_categories",
            url="http://localhost:5000/graphql",
            json={"query": query}
        )

    @task
    def get_locations(self):
        query = '''
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
        '''
        self.client.post(name="get_locations",
            url="http://localhost:5000/graphql",
            json={"query": query}
        )
    



#    type RootQuery {
#         user: User!
#         logout: QueryMessage!
#         orders(queryPageInput: QueryPageInput): [Order!]!
#         order(queryOrderInput: QueryOrderInput): Order!
#         locations(queryPageInput: QueryPageInput): [Location!]!
#         location(queryLocationInput: QueryLocationInput): Location!
#         products(queryProductInput: QueryProductInput): [Product!]!
#         toppings(queryPageInput: QueryPageInput): [Topping!]!
#         orderItem(queryOrderItemInput: QueryOrderItemInput): OrderItem
#         finalizedOrders(queryPageInput: QueryPageInput): [FinalizedOrder!]!
#         finalizedOrder(queryFinalizedOrderInput: QueryFinalizedOrderInput): FinalizedOrder!
#         categories(queryPageInput: QueryPageInput): [Category!]!
#     }

#     type RootMutation {
#         createUser(createUserInput: CreateUserInput): User
#         createOrder: Order
#         login(loginInput: LoginInput): User!
#         createLocation(createLocationInput: CreateLocationInput): Location!
#         createProduct(createProductInput: CreateProductInput): Product
#         createOrderItem(createOrderItemInput: CreateOrderItemInput): OrderItem
#         deleteOrderItem(deleteOrderItemInput: DeleteOrderItemInput): MutationMessage
#         createTopping(createToppingInput: CreateToppingInput): Topping
#         createCategory(createCategoryInput: CreateCategoryInput): Category
#     }
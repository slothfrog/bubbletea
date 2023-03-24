 
# Pepe’s Bubbles
 
## Project URL
 
https://www.pepesbubbles.me/
 
## Project Video URL
 
YouTube Link: [https://youtu.be/sz8IwBg3Ni0](https://youtu.be/sz8IwBg3Ni0)
 
## Project Description
 
Our app is a storefront of a fake bubble tea franchise with multiple locations. In the app, we have a menu page where the user can add items to their cart. The user has the ability to change the size of the drink, the amount of ice and the sugar levels of their drink as well as any extra topping they wish to add. When they try to check out their items, they can select the store they wish to pick up and at what time. The pickup time defaults to 15 minutes after the current time, and past time cannot be selected. For the payment, there are two options, pay in store and pay via PayPal. By paying in store, the order will immediately be sent to the store cashiers to prepare the order for the pick up time. With PayPal, the user will be redirected to PayPal where they input their PayPal information and confirm the payment. The way the payment flow is coded, if the PayPal confirmation is interrupted or canceled, the order will not be lost or sent to the store. They can restart the PayPal flow if they wish or pay in store instead. After checking out successfully, a confirmation page with the order id and an “add to calendar” button would show. Users can add to Apple, Google, Outlook, Outlook Web App, and Yahoo calendars. Time, location, and order number are displayed in the calendar details.
 
Aside from ordering drinks, there is a contact page that allows the user to send an email to a representative of the company. Their message will be sent along with their name and email and will receive an auto-reply that their message has been received. There is also a locations page that uses Google Maps API and displays all the locations of the franchise. In the search bar, the user inputs their location and information of the store that is closest to that location will appear. Users can also use the locator button next to the search bar to provide their current location.
 
## Development
Code design: 3 layers: frontend, backend, and database
 
Our application is built on three-tiered architecture using:
- React as the core framework driving our presentation layer 
- Node.js with Express as the main framework for the application layer
- mongoDB as our database layer
 
### Frontend:
React is our main frontend framework. All of our React components can be found under ```src``` and our css file for each component is in the same directory as the component js file. The components rely largely on Material UI for both styles and some user interactions. The Material UI components can be found all over the app and was used for their buttons, popup dialogs, icons, selection inputs, etc. A lot of the implementation is provided in the Material UI [docs](https://mui.com/getting-started/installation/) which we used frequently when developing our UI.
 
For our frontend API we used a state management library called Apollo Client to fetch, cache, and modify application data from our GraphQL backend. Apollo takes a GraphQL query or mutation string and sends a POST request with the query as the payload and gets the response from the backend with the corresponding parsed data.
 
The Google Maps API was used in the location page. With the data passed from the backend, we have the latitude and longitude of each restaurant location and is displayed on the map as a marker. The markers are a component  InfoWindow will display with the information on the selected marker. With an autocomplete places library, suggested locations will be returned which will appear as a dropdown under the input element. Once a location is selected by the user, using the same library as the autocomplete component, we can get the latitude and longitude of the inputted address. Using the distance, we sort all the locations by distance in ascending order and we display the information of the closest locations in the sidebar. 
 
Emailjs is an API used in our app to send emails between staff and customers using a custom template. We connect our gmail to emailjs and it allows us to send emails to any other email we want. The information given in the contact page is used as variables in our email template and the emails that are sent will be tailored to the customer.
 
The add to calendar functionality is implemented using an npm module, ```@culturehq/add-to-calendar```. The Google calendar option generates a link and opens a new tab where users need to sign in with their Google account, and calendar event details will be prefilled once they landed on the calendar page. For the other calendars, users need to download and click on the .ics files. The OS opens the corresponding app based on the headers in the .ics files.

 
 
 
### Backend:


##### Technology
The backend is built using JavaScript using Node.js and is driven using Express as the web application framework. The server uses GraphQL and REST as API standards. The GraphQL API is used to perform most actions such as logging in, creating orders, getting products, etc… whereas the REST API is used for payments and integrating with third party API’s from PayPal and Google. 

##### API
###### GraphQL
All requests to the GraphQL API go through the ```/graphql``` endpoint, resolvers for GraphQL requests are found in ```server/graphql/resolvers``` and the GraphQL API schema is detailed in ```server/graphql/schema/index.js```. The ```express-graphql``` and the ```graphql``` dependencies handles the defining of the GraphQL API schema, and routing from HTTP requests from Express to related request resolvers (handlers). The GraphQL API is used to perform most actions, there are resolvers for requests relating to users, products, toppings, orders, order items, locations, finalized orders, product categories.
See [docs/graphql.md](https://github.com/UTSCC09/project-pepe/blob/master/docs/graphql.md) for detailed API documentation.

###### REST
Endpoints for all REST API requests start at ```/rest```, and handlers for REST requests are located in ```server/rest```. The REST API is used for order payments, uploading product images (staff users only), and for easy integration with third party APIs. 
See [docs/rest.md](https://github.com/UTSCC09/project-pepe/blob/master/docs/rest.md) for detailed API documentation.


##### Google SSO
The backend uses OAuth2 to access Google APIs to perform SSO with Google accounts. The backend proctors these requests using REST on endpoints relative to ```/rest/oauth/google```. Requests handlers relating to Google SSO are found in ```server/rest/oauthRoutes/google/google.js```. Users can register and login using ```/rest/oauth/google/register``` and ```/rest/oauth/google/login```. There are also callback endpoints so Google can reply with user data after a register or login attempt.
 
##### Payments
The backend proctors requests relating to payments using the REST API relative to the ```/rest/payment``` endpoint. The backend uses the ```paypal-rest-sdk``` dependency to interact with PayPal’s REST API so that users can pay for orders using PayPal. There are callback endpoints located in ```server/rest/paymentRoutes/paypal/paypal.js```so PayPal can reply with payment information after payment.

##### Authentication
The backend uses session based authentication and uses the ```express-session``` dependency to manage sessions. Stored in the session is only the user id. To decouple sessions from the server, we used Memcached as an in-memory caching system to cache sessions. The ```connect-memcached``` allows for creation of a memory store connected to the Memcached server which can be used by the express-session dependency. For more info see deployment section.
 
##### Graylog
The backend logs errors to Graylog and uses the ```graylog2``` dependency to manage the connection to the Graylog server and send logs. Configuration for Graylog is found in ```server/config/default``` or ```server/config/production```. Only errors are logged, and no personal information is ever logged. For more info see maintenance section.
 
 
### Database:
The database technology used for our project is MongoDB. The backend uses the ```mongoose``` dependency to manage the connection and requests to the Mongo server. Models for the collections of the database are detailed in ```server/models```. Existing collections in the database are categories, finalizedorders, locations, orders, orderitems, payments, products, toppings, uploads, and users. 
 
Some documents in these collections refer to documents of other collections using their _id field as a foreign key. Our GraphQL API takes advantage of this structure to provide results for queries and mutations asking for information of nested objects.


## Deployment

##### Application deployment
Our project is deployed on https://www.pepesbubbles.me. We have dockerized deployment for our project on an EC2 server. The ```deploy/docker-compose.yml``` file details how our Docker containers are built. The container for the backend is built from the Node 12 alpine docker image, and depends on the mongodb and memcached containers to be built first. We are using Nginx as a reverse proxy in a container called ‘nginx’. The EC2 server’s HTTP/HTTPS ports are bound to the nginx container, and it serves the client files and acts as a reverse proxy to the backend api. Configurations for Nginx can be found in ```deploy/frontend/default.conf```, and database initializations can be found in ```deploy/mongodb/mongo-init.js```.
The nginx container serves a ssl certificate for www.pepesbubbles.me created with Certbot signed by LetsEncrypt.
 
##### Maintenance tools deployment
The deployment for a Graylog server has also been dockerized and its construction is detailed in ```deploy/maintenance/docker-compose.yml```. After the construction of an elasticsearch, a mongodb container, the graylog container is built.
Due to system specifications we were unable to actually deploy the Graylog server to production. Our EC2 server has only 1GB RAM and 1 vCPU whereas Graylog system requirements are 8 GB RAM, 4 CPU Cores. If we had a more powerful deployment server, we would have been able to deploy the Graylog server as well. 
See maintenance section for more info.
 
 
## Maintenance
##### System monitoring
Since the application is deployed with an EC2 server we have available system monitoring tools through the AWS console. These tools allow easy monitoring of CPU utilization, network packets (in/out), disk read/writes, etc…. With these tools we can monitor system integrity to ensure that nothing is going wrong with the system itself.
 
##### Graylog logging
To ensure that nothing is going wrong with the backend itself in production, we are reporting all error logs to a Graylog server. Only errors are being logged, and no personal information is being logged.
 
We were only able to get the Graylog server working locally and were not able to deploy the server to production due to the system requirements of a Graylog server. Our EC2 server has only 1GB RAM and 1 vCPU whereas Graylog system requirements are 8 GB RAM, 4 CPU Cores. If we had a more powerful deployment server, we would have been able to deploy the Graylog server as well. 
 
With the backend logging errors to the Graylog server, we can ensure that everything is working as expected through the single Graylog portal. Viewable there are messages logged by the server and charts for messages per seconds, etc….
 
See [docs/graylog](https://github.com/UTSCC09/project-pepe/tree/master/docs/graylog) for images of the Graylog portal working in the local development environment.
 
##### Locust
We have also created a locust script located in ```locust/locust.py``` that does a basic stress test of the most common requests, these are, query products, query locations, query toppings, query categories. With the results from running the locust script on production, we can identify the server capacity and make educated maintenance decisions based on that.
 

## Challenges
1. Learning to deploy our application with Docker was challenging. We containerized every aspect of the application which was difficult to learn, but made deployment very simple once we learned it.
2. Learning the GraphQL api standard was a challenge. It was also challenging to leverage it in places where its strengths are useful. For integrating with 3rd party APIs we used a simple REST API since GraphQL would be overkill or simply incompatible with some third party APIs.
3. Integrating with various 3rd party APIs in the client and the backend was challenging. Integrating with various third party platforms, each with their own steps to integrate, was a challenge. One API that was particularly challenging was the Google API.
 
## Contributions
 
Monique Tze-Yung Chan
- Menu Page
- Product Pop-up Dialog 
- Contact Page
- Locations Page
- Sign-In/ Sign-up Page

Shu-Shuan Wang
- Cart Page
- Success/Error Pages (add to calendar)
- Mockup design
- Create drinks pictures

Joshua Esteban Carrasco Sousa
- Backend
    - GraphQL API
    - REST API
- Deployment to EC2 server with Dockerized Nginx, Node.js, MongoDB, Memcached, Graylog
- Locust stress test script
 
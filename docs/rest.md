## REST API Endpoints
 ### POST /rest/payment/pay
 @body: orderId String, paymentMethod String, readyDate String, locationId String.
 @desc: Starts payment workflow process using specified payment method for the specified order id at the specified location at the specified date.
 @return:
 - 200 OK: The payment initiation was successful.
 - 500 INTERNAL SERVER ERROR: Could not initiate payment workflow.
 - 409 CONFLICT: The specified order cannot be paid for due to conflict.
 - 404 NOT FOUND: A specified resource was not found
 - 400 BAD REQUEST: There invalid or missing fields in the request body.
 

 ### POST /rest/payment/paypal/success
 @body: orderId String, payerId String, paymentId String, readyDate String, locationId String.
 @desc: Executes the paypal payment with the specified information.
 @return:
 - 200 OK: The payment was executed successfully.
 - 500 INTERNAL SERVER ERROR: The paypal payment could not be executed.
 - 404 NOT FOUND: A specified resource was not found
 - 401 UNAUTHORIZED: User not authorized to execute paypal payment.


 ### POST /rest/payment/paypal/cancel
 @body: orderId String, internalPaymentId.
 @desc: Cancels the initiated PayPal payment.
 @return:
 - 200 OK: The payment was successfully cancelled.
 - 500 INTERNAL SERVER ERROR: The paypal payment could not be cancelled.
 - 404 NOT FOUND: A specified resource was not found
 - 401 UNAUTHORIZED: User not authorized to cancel paypal payment.


 ### POST /rest/upload/product/:productId  
 @query: productId String
 @body: form-data encoded, picture
 @desc: Uploads an image and associates it with specified productId.
 @return:
 - 200 OK: File uploaded and attached to productId specified.
 - 400 BAD REQUEST: If the request is improperly formatted.
 - 401 UNAUTHORIZED: Unauthorized to perform this action.
 

 ### GET /rest/upload/product/:productId  
 @query: productId String
 @desc: Gets image associated with given productId.
 @return:
 - 200 OK: Image for specified productId was found.
 - 400 BAD REQUEST: Missing or invalid fields in query.
 - 404 NOT FOUND: Resource was not found.
 
 ### GET /rest/oauth/google/register
 @desc: Redirects to Google SSO page
 @return:
 - 200 OK: Redirected 
 
 ### GET /rest/oauth/google/register/callback
 @params: code String
 @desc: Registers new user from the specified google code.
 @return:
 - 200 OK: User registered from google code specified.
 - 403 FORBIDDEN: Could not create user. 

 ### GET /rest/oauth/google/login
 @desc: Redirects to Google SSO page
 @return:
 - 200 OK: Redirected 
 
 ### GET /rest/oauth/google/login/callback
 @params: code String
 @desc: If google code valid, creates session for user
 @return:
 - 200 OK: Redirected to client host.
 
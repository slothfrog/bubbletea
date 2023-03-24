# Todo
(this section is just a todo list for development purposes)

- Revise locust script
- Remove pagination to some graphql resolvers
- Bug fixes

# To start server

- Install dependencies using ```npm install```
    - If errors arise use ```--legacy-peer-deps``` flag
- Set configuration for ```MONGO_OPTIONS``` so the app can connect to the database. See Config files section.
- Ensure memcached is installed
- Run ```npm start```

# Setting up memcached
- On ubuntu: `sudo apt install memcached`

# Setting up MongoDB
- Follow instructions from [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) for Ubuntu
- Follow instructions from [here](https://www.mongodb.com/try/download/community?tck=docs_server) for Windows

# Config files
For development, set values in ```config/default.js```, For production, set values in ```config/production.js```.
- Set values for ```MONGO_OPTIONS``` to set up the database. If you would like to use a custom uri with other options then set ```CUSTOM_URI```.
- Set ```PORT``` as you would like.
- Set ```JWT_SECRET``` as the secret key for jwt encoding.
- Create an app in the [PayPal developer portal](https://developer.paypal.com/developer/accounts) and use the given client_id and client_secret in ```PAYPAL_OPTIONS```.
- Set ```CORS_ENABLED``` and ```CORS_ORIGIN``` as you would like.


## Troubleshooting local MongoDB connection if you are using WSL2
- In WSL2 the linux subsystem is a true VM and has it's own network. WSL1 on the other hand was not a true VM and didn't have it's own network, so you could connect to windows host without much work.
    - You may have to change firewall rules so that WSL2 can reach the host. See [here](https://stackoverflow.com/questions/70566305/unable-to-connect-to-local-server-on-wsl2-from-windows-host).



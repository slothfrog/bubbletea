const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const config = require('config');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const { setAuthenticated, setIsStaff } = require('./middleware/authentication');
const cookieParser = require('cookie-parser');
const { ErrorData } = require('./utils/error');
const app = express();
const cors = require('cors');
const session = require('express-session');
const MemcachedStore = require('connect-memcached')(session);
const graylog2 = require('graylog2');

// Logging with graylog
if(config.get("GRAYLOG_ENABLED")) {
    var logger = new graylog2.graylog(config.get("GRAYLOG_OPTIONS"));
}

// Allows CORS requests from CORS_ORIGIN
if(config.get("CORS_ENABLED")) {
    app.use(cors({
        origin: config.get("CLIENT_HOST"),
        optionsSuccessStatus: 200, // legacy browsers
        credentials: true
    }));
}

app.use(bodyParser.json());
app.use(cookieParser());

let memcachedConfig = config.get("MEMCACHED_OPTIONS");

const store = new MemcachedStore({
    hosts: [memcachedConfig.URL]
}, (err) => {
    console.log(`LOG: Failed connection to memcache`);
    console.log(err);
    throw err;
});

app.use(session({
    secret: config.get("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(setAuthenticated);
app.use(setIsStaff);

// Log requests in development
if(process.env.NODE_ENV != "production") {
    app.use((req, res, next) => {
        console.log(`HTTP request ${req.method}\tAuthenticated: ${req.isAuth}\t${req.url}`);
        next();
    });
}

const restRoutes = require('./rest/rest');
app.use('/rest', restRoutes);

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    customFormatErrorFn: (error) => {
        let errData = ErrorData[error.message];
        let errorInfo = errData || error;
        
        let ret = {
            message: errorInfo.message,
            statusCode: errorInfo.statusCode,
            locations: error.locations,
            path: error.path
        };

        if(config.get("GRAYLOG_ENABLED")) logger.error(JSON.stringify(ret));
        return ret;
    }
}));

const mongoConfig = config.get("MONGO_OPTIONS");
const mongoUri = mongoConfig.CUSTOM_URI || `${mongoConfig.PROTOCOL}${mongoConfig.HOST}:${mongoConfig.PORT}/${mongoConfig.DB_NAME}`;

console.log(`LOG: Attempting connection to database ${mongoUri}`);
mongoose.connect(mongoUri).then(() => {
    console.log(`LOG: Connected to database ${mongoUri}`);
    let PORT = config.get("PORT");
    app.listen(PORT, () => {
        console.log(`LOG: Server started on PORT ${PORT}`);
    });
}).catch((err) => {
    console.log(`LOG: Failed connection to database ${mongoUri}`);
    console.log(err);
    throw err;
});

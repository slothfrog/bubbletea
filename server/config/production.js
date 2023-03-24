module.exports = {
    PORT: 80,
    SESSION_SECRET: "evenmoreinsanelysecretabsolutelynooneknows",
    SERVER_HOST: "https://www.pepesbubbles.me/api",
    CLIENT_HOST: "https://www.pepesbubbles.me",
    MONGO_OPTIONS: {
        PROTOCOL: "",
        HOST: "",
        PORT: "",
        DB_NAME: "",
        CUSTOM_URI: "mongodb://pepe:cscc09project@mongodb:27017/pepesbubblesDB"
    },
    COOKIE_OPTIONS: {
        sameSite: 'strict',
        httpOnly: true,
        secure: true
    },
    PAYPAL_OPTIONS: {
        client_id: "AXEv-cSAvC7t-IndeM2VJASj4SZiAeOLQ_erCWYFyVpZC_n77rqq_b5gsJcxB2racc245Uu6fyT_QG3O",
        client_secret: "EK4iq8u6dsccObe6JeRiwYxGJxSjYPIUDNokykwhSOkGsM13FwES1bx132cXKlhS579giKiFKM182aNH"
    },
    GOOGLE_OAUTH_OPTIONS: {
        clientSecret: "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",
        clientId: "94321156179-qfvem254ro66feaqagio9trp703pg0sc.apps.googleusercontent.com",
    },
    CORS_ENABLED: false,
    UPLOADS_DEST: 'uploads/',
    MEMCACHED_OPTIONS: {
        URL: "memcached:11211"
    },
    GRAYLOG_ENABLED: false,
    GRAYLOG_OPTIONS: {
        servers: [
            { host: '127.0.0.1', port: 12111 },
            { host: '127.0.0.2', port: 12111 }
        ],
        hostname: "Pepe's Server",
        facility: "node.js",
        bufferSize: 1350
    }
}
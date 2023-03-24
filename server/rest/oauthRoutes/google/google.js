// REST api for oauth with google
// endpoints relative to /rest/oauth/google
const express = require('express');
const config = require('config');
const google = require('googleapis');
const axios = require('axios');
const UserService = require('../../../services/userservice');
const UserTypes = require('../../../enums/UserTypes');
const User = require('../../../models/user');
const UserRoles = require('../../../enums/UserRoles');
const { GOOGLE_USER } = require('../../../utils/constant');

let router = express.Router();

const authOptions = config.get("GOOGLE_OAUTH_OPTIONS");
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];

var createClient = (uri) => {
    return new google.Auth.OAuth2Client({
        ...authOptions,
        redirectUri: uri
    });
};

router.get('/register', (req, res, next) => {
    const oauth2Client = createClient(`${config.get("SERVER_HOST")}/rest/oauth/google/register/callback`);

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: defaultScope,
        prompt: 'consent',
        include_granted_scopes: true
    });
    res.status(200).redirect(url);    
});

router.get('/register/callback', async (req, res, next) => {
    try {
        const oauth2Client = createClient(`${config.get("SERVER_HOST")}/rest/oauth/google/register/callback`);

        let { tokens } = await oauth2Client.getToken(req.query.code);

        const { data } = await axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });
        if(!data) throw new Error();

        // Check user exists
        if(await UserService.userExists(data.email)) return res.status(409).end("User already exists");

        let result = await UserService.createUser(data.email, "", data.name || GOOGLE_USER, UserRoles.customer, UserTypes.sso);
        
        // new session
        req.session.userId = result._doc._id;
        return res.status(200).redirect(config.get("CLIENT_HOST"));
    } catch(e) {
        res.status(403).end("Could not create user");
    }    
});

router.get('/login', (req, res, next) => {
    const oauth2Client = createClient(`${config.get("SERVER_HOST")}/rest/oauth/google/login/callback`);

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: defaultScope,
        prompt: 'consent',
        include_granted_scopes: true
    });

    res.status(200).redirect(url);    
});

router.get('/login/callback', async (req, res, next) => {
    try {
        const oauth2Client = createClient(`${config.get("SERVER_HOST")}/rest/oauth/google/login/callback`);

        let { tokens } = await oauth2Client.getToken(req.query.code);

        const { data } = await axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            }
        });

        if(!data) throw new Error();

        // Check user exists
        let foundUser = await User.findOne({ email: data.email });

        if(!foundUser) return res.status(200).redirect(config.get("CLIENT_HOST"));

        // new session
        req.session.userId = foundUser._doc._id;

        return res.status(200).redirect(config.get("CLIENT_HOST"));
    } catch(e) {
        console.log(e);
        return res.status(200).redirect(config.get("CLIENT_HOST"));
    }  
});

module.exports = router;

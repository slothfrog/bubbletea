// // Exports helpers for oauth

// const config = require('config');
// const google = require('googleapis');

// const defaultScope = [
//     'https://www.googleapis.com/auth/plus.me',
//     'https://www.googleapis.com/auth/userinfo.email',
// ];


// const createGoogleOAuthConnection = () => {
//     return new google.Auth.OAuth2Client({
//         clientId: config.get("GOOGLE_OAUTH_OPTIONS").OAUTH_CLIENT_ID,
//         clientSecret: config.get("GOOGLE_OAUTH_OPTIONS").OAUTH_SECRET,
//         redirectUri: "http://localhost:5000/rest/oauth/google/callback"
//     });
// };

// const getGoogleConnectionUrl = (auth) => {
//     return auth.generateAuthUrl({
//         access_type: 'offline',
//         prompt: 'consent',
//         scope: defaultScope
//     });
// };

// const urlGoogle = () => {
//     const auth = createGoogleOAuthConnection();
//     const url = getGoogleConnectionUrl(auth);
//     return url;
// };

// const getGooglePlusApi = (auth) => {
//     return google.plus_v1(auth);
// };

// const getGoogleAccountFromCode = async (code) => {
//     // get auth 'tokens' from request
//     const auth = createGoogleOAuthConnection();
//     const data = await auth.getToken(code);
    
//     console.log('here');
//     // const data = await auth.getToken(code);
//     // const tokens = data.tokens;

//     // // add tokens to the google api so we have access to account
//     // const auth = createGoogleOAuthConnection();
//     // auth.setCredentials(tokens);

//     // // connect to google + - need this to get users email
//     // const plus = getGooglePlusApi(auth);
//     // const me = await plus.people.get({userId: 'me'});

//     // console.log(me);
//     // const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;

//     // return {
//     //     email: userGoogleEmail,
//     //     tokens: tokens
//     // };
// };

// exports.urlGoogle = urlGoogle;
// exports.getGoogleAccountFromCode = getGoogleAccountFromCode;
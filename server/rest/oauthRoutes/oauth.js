// REST api for oauth
// endpoints relative to /rest/oauth

const express = require('express');

let router = express.Router();

const googleRoutes = require('./google/google');
router.use('/google', googleRoutes);

module.exports = router;

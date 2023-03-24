// REST api
// endpoints relative to /rest
const express = require('express');
let router = express.Router();


const paymentRoutes = require('./paymentRoutes/payments');
router.use('/payment', paymentRoutes);

const uploadRoutes = require('./uploadRoutes/uploads');
router.use('/upload', uploadRoutes);

const oAuthRoutes = require('./oauthRoutes/oauth');
router.use('/oauth', oAuthRoutes);

module.exports = router;
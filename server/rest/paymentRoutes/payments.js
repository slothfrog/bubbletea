// REST api for payments
// endpoints relative to /rest/payment
const express = require('express');
const config = require('config');
const paypal = require('paypal-rest-sdk');
const PaymentMethods = require('../../enums/PaymentMethods');
const { isValidDate } = require('../../helpers/validators');
const { startPaypalPayment, payInStore } = require('../../helpers/payments');
const Location = require('../../models/location');

let router = express.Router();

const paypalRoutes = require('./paypal/paypal');
router.use('/paypal', paypalRoutes);

paypal.configure({
    mode: 'sandbox',
    client_id: config.get("PAYPAL_OPTIONS").client_id,
    client_secret: config.get("PAYPAL_OPTIONS").client_secret
});

// /rest/payment/pay
router.post('/pay', async (req, res, next) => {
    const orderId = req.body.orderId;
    const paymentMethod = req.body.paymentMethod;
    const readyDate = req.body.readyDate;
    const locationId = req.body.locationId;

    // Valid payment method exists
    if(!paymentMethod) return res.status(400).end("Missing paymentMethod in body");
    const validPaymentMethod = Object.values(PaymentMethods).indexOf(paymentMethod) >= 0 ? true : false;
    if(!validPaymentMethod) return res.status(400).end("Payment method invalid");

    // Ensure date is valid
    if(!isValidDate(readyDate)) return res.status(400).end("Invalid Date");

    // Ensure location is valid
    let foundLocation = await Location.findById(locationId);
    if(!foundLocation) return res.status(404).end("Location doesn't exist");
    // Order Id exists
    if(!orderId) return res.status(400).end("Missing orderId in body");
    
    // Is authenticated
    if(!req.isAuth) return res.status(401).end("Unauthenticated.");

    if(paymentMethod === PaymentMethods.instore) {
        return payInStore(req, res, next);
    } else if (paymentMethod === PaymentMethods.paypal) {
        return startPaypalPayment(req, res, next);
    }
});


module.exports = router;

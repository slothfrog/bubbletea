// REST api for file uploads
// endpoints relative to /rest/upload/
const express = require('express');
const multer = require('multer');
const Errors = require('../../utils/error');
const config = require('config');
const upload = multer({ dest: config.get('UPLOADS_DEST')});
const Product = require('../../models/product');
const { isValidObjectId } = require('mongoose');
const UploadModel = require('../../models/upload');
const path = require('path');
const fs = require('fs');

let router = express.Router();

// Upload image for product
router.post('/product/:productId', 
    async (req, res, next) => {
        if(!req.isStaff) return res.status(400).end(Errors.ErrorData.UNAUTHORIZED.message);
        const productId = req.params.productId;

        if(!isValidObjectId(productId)) return res.status(400).end(Errors.ErrorData.INVALID_ID.message);
        if(!productId) return res.status(400).end(Errors.ErrorData.MISSING_FIELDS.message('productId'));

        let foundProduct = await Product.findById(productId);

        if(!foundProduct) return res.status(404).end(Errors.ErrorData.PRODUCT_DNE.message);
        
        next();
    }, 
    upload.single('picture'), 
    async (req, res, next) => {

        const productId = req.params.productId;

        let newUpload = {
            ref: productId,
            filename: req.file.filename,
            mimetype: req.file.mimetype
        };

        let foundOldUpload = await UploadModel.findOne({ ref: productId });
        if(foundOldUpload) {
            fs.unlink(path.join(__dirname, '../../uploads', foundOldUpload.filename), () => {});
        }

        let result = await UploadModel.findOneAndUpdate({ ref: productId }, newUpload, { upsert: true, new: true });
        
        await Product.findOneAndUpdate({ _id: productId }, { upload: result._doc._id }, { new: true });

        return res.status(200).end("Uploaded file");
    }
);

// get image for product
router.get('/product/:productId', async (req, res, next) => {
    const productId = req.params.productId;

    if(!isValidObjectId(productId)) return res.status(400).end(Errors.ErrorData.INVALID_ID.message);
    if(!productId) return res.status(400).end(Errors.ErrorData.MISSING_FIELDS.message('productId'));

    let foundProduct = await Product.findById(productId);
    if(!foundProduct) return res.status(404).end(Errors.ErrorData.PRODUCT_DNE.message);
    if(!foundProduct._doc.upload) return res.status(404).end(Errors.ErrorData.UPLOAD_DNE.message);

    let foundUploadMetadata = await UploadModel.findOne({ ref: productId });
    if(!foundUploadMetadata) return res.status(404).end(Errors.ErrorData.UPLOAD_DNE.message);

    res.setHeader('Content-Type', foundUploadMetadata.mimetype);
    res.sendFile(path.join(__dirname, '../../uploads', foundUploadMetadata.filename), (err) => {
        if(err) res.status(err.status).end();
    });
});

module.exports = router;

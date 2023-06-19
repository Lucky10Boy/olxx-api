const express = require('express');
const cloudinary = require('../controllers/cloudinaryController');

const router = express.Router();

router.route('/upload/product/images').post(cloudinary.uploadProductImages);
router.route('/upload/user/image').post(cloudinary.uploadProductImages);
router.route('/remove/image').post(cloudinary.remove);
module.exports = router;

const express = require('express');
const productController = require('../controllers/productController');
const { protect, imageChecker } = require('../middlewares/utils');
const router = express.Router();

router.route('/category/product').post(productController.getProductsByCategory);
router.route('/category/sub/product').post(productController.getProductsBySubCategory);
router.route('/category/sub/super/product').post(productController.getProductsBySuperSubCategory);

router.route('/product/create').post(protect, imageChecker, productController.createProduct);
router.route('/product/edit/:id').patch(productController.editProduct);
router.route('/product/remove/:id').delete(protect, productController.removeProduct);
router.route('/products/get').get(productController.getProducts);
router.route('/product/single/get').post(productController.getSingleProduct);
router.route('/product/related/get').post(productController.getRelatedProducts);
router.route('/products/search/:key').get(productController.searchProducts);
router.route('/product/author/get').post(productController.getAuthorProducts);
router.route('/product/user/get').post(protect, productController.getUserProducts);

module.exports = router;

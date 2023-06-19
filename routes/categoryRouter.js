const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.route('/category').post(categoryController.createCategory);
router.route('/categories').get(categoryController.findCategories);
module.exports = router;

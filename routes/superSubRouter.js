const express = require('express');
const superSubCategory = require('../controllers/superSubController');

const router = express.Router();

router
  .route('/super-sub-category')
  .post(superSubCategory.createSuperSubCategory);
router
  .route('/super-sub-categories')
  .post(superSubCategory.findSuperSubCategories);

module.exports = router;

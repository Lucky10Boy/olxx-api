const express = require('express');
const subCategory = require('../controllers/subCategoryController');

const router = express.Router();

router.route('/sub-category').post(subCategory.createSubCategory);
router.route('/sub-categories/all').get(subCategory.findSubCategories);
router
  .route('/category/sub-categories')
  .post(subCategory.findSubCategoriesByParentCategory);
module.exports = router;

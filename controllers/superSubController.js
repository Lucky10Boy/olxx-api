const SubCategory = require('../models/subCategoryModel');
const SuperSubCategory = require('../models/superSubCategoryModel');
const slugify = require('slugify');

exports.createSuperSubCategory = async (req, res, next) => {
  const newSuperSubCategory = await SuperSubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    parentSubCategory: req.body.parentSubCategory,
  });

  const parentSubCategory = await SubCategory.findByIdAndUpdate(
    req.body.parentSubCategory,
    {
      $push: { superSubCategory: newSuperSubCategory._id },
    }
  );

  res.json({
    message: 'Новая супер суб категория создалась успешно',
    status: 'success',
    newSuperSubCategory,
    parentSubCategory,
  });
};
exports.findSuperSubCategories = async (req, res, next) => {
  const superSubCategories = await SuperSubCategory.find({
    parentSubCategory: req.body.parentSubCategory,
  });
  res.json({ superSubCategories });
};

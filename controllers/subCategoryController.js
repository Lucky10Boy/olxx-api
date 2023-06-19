const SubCategory = require('../models/subCategoryModel');
const slugify = require('slugify');
const Category = require('../models/categoryModel');
const AppError = require('../AppError');

exports.createSubCategory = async (req, res, next) => {
  const newSubCategory = await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    parentCategory: req.body.parentCategory,
    superSubCategory: req.body.superSubCategory,
  });
  const parentCategory = await Category.findByIdAndUpdate(
    req.body.parentCategory,
    {
      $push: { subCategory: newSubCategory._id },
    }
  );
  res.json({
    message: 'Новая категория создалась успешно',
    status: 'success',
    newSubCategory,
    parentCategory,
  });
};

exports.findSubCategories = async (req, res, next) => {
  const subCategories = await SubCategory.find().populate('parentCategory');
  res.json({
    status: 'success',
    message: 'Суб категории',
    subCategories,
  });
};
exports.findSubCategoriesByParentCategory = async (req, res, next) => {
  if (!req.body.parentCategory) {
    return next(
      new AppError('Нету категории!Сделайте запрос заново с категорией', res)
    );
  }
  const subCategories = await SubCategory.find({
    parentCategory: req.body.parentCategory,
  });
  if (!subCategories) {
    return next('Не найдены суб категории! Сделайте запром попозже!');
  }
  return res.json({
    status: 'success',
    message: 'Суб категории',
    subCategories,
  });
};

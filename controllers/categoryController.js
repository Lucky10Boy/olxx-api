const Category = require('../models/categoryModel');
const slugify = require('slugify');

exports.createCategory = async (req, res, next) => {
  const newCategory = await Category.create({
    name: req.body.name,
    image: req.body.image,
    slug: slugify(req.body.name),
    subCategory: req.body.subCategory,
    superSubCategory: req.body.superSubCategory,
  });
  res.json({
    message: 'Новая категория создалась успешно',
    status: 'success',
    newCategory,
  });
};

exports.findCategories = async (req, res, next) => {
  const categories = await Category.find();
  res.json({
    message: 'Все категории',
    status: 'success',
    categories,
  });
};

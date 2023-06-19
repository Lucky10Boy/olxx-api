const Product = require('../models/productModel');
const slugify = require('slugify');
const AppError = require('../appError');
const catchAsync = require('../catchAsync');
const uniqid = require('uniqid');

exports.createProduct = async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.postedBy = req.user._id;
  if (req.body.images === undefined || req.body.images.length == 0) {
    req.body.images.push({
      url: 'https://res.cloudinary.com/olxx/image/upload/v1672845933/404image_hs9onj.webp',
      public_id: uniqid(),
    });
  }
  req.body.isVerified = true;
  const newProduct = await Product.create(req.body);
  res.json({
    message: 'Новое объявление успешно создано',
    status: 'success',
    newProduct,
  });
};
exports.editProduct = async (req, res, next) => {
  if (req.body.images === undefined || req.body.images.length == 0) {
    req.body.images.push({
      url: 'https://res.cloudinary.com/olxx/image/upload/v1672845933/404image_hs9onj.webp',
      public_id: uniqid(),
    });
  }
  const editedProduct = await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({
    message: 'Объявление успешно изменено',
    status: 'success',
    editedProduct,
  });
};

exports.getProductsByCategory = async (req, res, next) => {
  const productsByCategory = await Product.find({
    category: req.body.category,
    isVerified: true,
  })
    .populate('category')
    .populate('subCategory')
    .populate('superSubCategory');
  res.json({
    status: 'success',
    products: productsByCategory,
  });
};
exports.getProductsBySubCategory = async (req, res, next) => {
  const productsBySubCategory = await Product.find({
    subCategory: req.body.subCategory,
    isVerified: true,
  })
    .populate('parentCategory')
    .populate('superSubCategory');
  res.json({
    status: 'success',
    products: productsBySubCategory,
  });
};
exports.getProductsBySuperSubCategory = async (req, res, next) => {
  const productsBySuperSubCategory = await Product.find({
    superSubCategory: req.body.superSubCategory,
    isVerified: true,
  }).populate('parentSubCategory');
  res.json({
    status: 'success',
    products: productsBySuperSubCategory,
  });
};
exports.getProducts = async (req, res, next) => {
  const products = await Product.find({ isVerified: true }).populate('category').populate('subCategory').populate('superSubCategory');
  res.json({
    status: 'success',
    products,
  });
};
exports.searchProducts = async (req, res, next) => {
  console.log(req.params.key);
  const filteredProducts = await Product.find({
    $or: [{ name: { $regex: req.params.key } }],
  })
    .populate('category')
    .populate('subCategory')
    .populate('superSubCategory');
  res.json({
    status: 'success',
    filteredProducts,
  });
};
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.body.id).populate('category').populate('subCategory').populate('superSubCategory').populate('postedBy');
  console.log(product.postedBy);
  res.json({
    status: 'success',
    product,
  });
};

exports.getRelatedProducts = catchAsync(async (req, res, next) => {
  if (!req.body.category) {
    return next(new AppError('Нету категории!', res));
  }
  const products = await Product.find({
    category: req.body.category,
    isVerified: true,
    _id: { $ne: req.body.id },
  }).limit(3);
  res.json({
    status: 'success',
    message: 'Продукты!',
    products,
  });
});
exports.getAuthorProducts = catchAsync(async (req, res, next) => {
  if (!req.body.author) {
    return next(new AppError('Нет автора', res));
  }
  console.log(req.body.author);
  const products = await Product.find({
    postedBy: req.body.author,
  }).limit(3);
  res.json({
    status: 'success',
    message: 'Продукты!',
    products,
  });
});
exports.getUserProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ postedBy: req.user });
  res.json({
    status: 'success',
    message: 'Продукты!',
    products,
  });
});
exports.removeProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    message: 'Успешно удалено!',
  });
});

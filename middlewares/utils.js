const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

  if (token === '') {
    res.json({
      message: 'Пожалуйста сперва авторизуйтесь',
      status: 'fail',
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  const user = await User.findById(decoded.id);
  console.log(user);
  if (user.changedPasswordAfter(decoded.iat)) {
    return next();
  }

  req.user = user;
  console.log('user successfully ended the verification process');

  next();
};

exports.imageChecker = async (req, res, next) => {
  if (req.body.images !== []) {
    next();
  }
  req.body.images = [
    {
      url: 'https://res.cloudinary.com/olxx/image/upload/v1672845933/404image_hs9onj.webp',
    },
  ];
};

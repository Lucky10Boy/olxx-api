const User = require('../models/userModel');
const Product = require('../models/productModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Email = require('../email');
const catchAsync = require('../catchAsync');
const AppError = require('../AppError');

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.SECRET_KEY || 'somethingsuperpuperultramarvelbarcelonasecret',
    {
      expiresIn: '90d',
    }
  );
};

exports.register = catchAsync(async (req, res, next) => {
  if (!req.body.phoneNumber && req.body.email) {
    const password = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password,
      avatarPhoto: req.body.avatarPhoto,
      phone: req.body.phone,
    });
    const emailVerificationCode = user.createEmailVerificationCode();
    await user.save();
    const url = `http://${process.env.REACT_APP}/user/register/verify`;
    try {
      await new Email(req.body.email, url).sendEmailVerification(
        emailVerificationCode
      );
      res.json({
        message: 'Почта отправлена!',
        status: 'success',
        url,
        emailVerificationCode,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError(
          'В сервере произошла ошибка. Сделайте запрос попозже.',
          res
        )
      );
    }
  } else if (!req.body.email && req.body.phoneNumber) {
    const password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      name: req.body.name,
      password,
      avatarPhoto: req.body.avatarPhoto,
      phoneNumber: req.body.phoneNumber,
      verified: true,
    });

    console.log(req.body);
    const id = newUser._id;
    const token = signToken(id);

    res.status(201).json({
      message: 'Вы успешно зарегистрированы!',
      user: newUser,
      token,
      status: 'success',
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.password) {
    return next(new AppError('Пожалуйста введите почту и пароль', res));
  }
  if (!req.body.phoneNumber && req.body.email) {
    const user = await User.findOne({
      email: req.body.email,
      verified: true,
    }).select('+password');
    if (!user) {
      return next(new AppError('Почта является неверна', res));
    }

    const withoutPasswordUser = await User.findOne({
      email: req.body.email,
      verified: true,
    });
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return next(new AppError('Пароль неверен', res));
    }
    console.log('password is correct');
    console.log(user);
    const token = signToken(user._id);

    res.json({
      message: 'Вы успешно авторизовались',
      token,
      user: withoutPasswordUser,
      status: 'success',
    });
  } else if (!req.body.email && req.body.phoneNumber) {
    const user = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    }).select('+password');
    if (!user) {
      return next(new AppError('Номер телефона является неверна', res));
    }

    console.log(user);
    if (user.verified === false) {
      return next(
        new AppError('Пожалуста сначала подтвердите свой аккаунт', res)
      );
    }
    const withoutPasswordUser = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return next(new AppError('Пароль неверен', res));
    }
    console.log('password is correct');
    console.log(user);
    const token = signToken(user._id);

    res.json({
      message: 'Вы успешно авторизовались',
      token,
      user: withoutPasswordUser,
      status: 'success',
    });
  }
});

exports.addToFavorites = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { favorites: req.body.productId },
  });

  res.json({
    status: 'success',
    message: 'Продукт добавлен в избранные',
    user,
  });
});

exports.verifyProduct = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError(
        'Чтобы сделать этот запрос вы должны быть администратором',
        res
      )
    );
  }
  if (!req.body.productId) {
    return next(new AppError('ID продукта является неверным', res));
  }
  await Product.findByIdAndUpdate(req.body.productId, {
    isVerified: true,
  });
  res.json({
    message: 'Продукт успешно подтвержден',
    status: 'success',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('Пожалуйста введите электронную почту', res));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Электронная почта является неверна', res));
  }
  const passwordResetToken = user.createPasswordResetToken();
  await user.save();
  const url = `http://${process.env.REACT_APP}/user/reset/password/${passwordResetToken}`;
  try {
    await new Email(user.email, url).sendPasswordReset();
    res.json({
      message: 'Почта отправлена!',
      status: 'success',
      url,
      passwordResetToken,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    console.log(error);
    return next(
      new AppError('В сервере произошла ошибка. Сделайте запрос попозже.', res)
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const user = await User.findOne({
    passwordResetToken: req.params.passwordResetToken,
  }).select('+password');
  if (user.passwordResetExpires < Date.now()) {
    return next(new AppError('Пожалуйста попробуйте позже', res));
  }
  if (!user) {
    return next(new AppError('Ваш токен истек', res));
  }
  user.password = bcrypt.hashSync(req.body.password, 12);

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ status: 'success', message: 'Успешно сбросили пароль' });
});

exports.registerComplete = catchAsync(async (req, res, next) => {
  if (!req.body.emailVerificationCode) {
    return next(new AppError('Пожалуйста введите электронную почу', res));
  }
  const user = await User.findOne({
    emailVerificationCode: req.body.emailVerificationCode,
  });
  if (!user) {
    return next(new AppError('Неверный код', res));
  }
  user.verified = true;
  user.emailVerificationCode = undefined;
  await user.save();
  console.log(user);
  const id = user._id;
  const token = signToken(id);

  res.status(201).json({
    message: 'Вы успешно зарегистрированы!',
    user,
    token,
    status: 'success',
  });
});

exports.editPassword = catchAsync(async (req, res, next) => {
  if (req.body.email) {
    const user = await User.findOneAndUpdate({
      email: req.body.email,
      password: req.body.password,
    }).select('+password');
    if (!user) {
      return next(new AppError('Ваш токен истек', res));
    }
    user.password = req.body.password;

    user.password = bcrypt.hashSync(req.body.password, 12);

    await user.save();
    res.json({ status: 'success', message: 'Успешно изменили пароль' });
  }
  if (req.body.phoneNumber) {
    const user = await User.findOneAndUpdate(phoneNumber, password).select(
      '+password'
    );
    if (!user) {
      return next(new AppError('Проблема в сервере. Попробуйте позже', res));
    }
    user.password = bcrypt.hashSync(req.body.password, 12);

    await user.save();
    res.json({ status: 'success', message: 'Успешно изменили пароль' });
  }
});
exports.editPhoneNumber = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const phoneNumber = req.body.phoneNumber;
  const user = await User.findOne({
    phoneNumber: req.body.oldPhoneNumber,
  });
  console.log(user);
  if (!user) {
    return next(new AppError('Проблема в сервере. Попробуйте позже', res));
  }
  user.phoneNumber = phoneNumber;
  await user.save();
  res.json({
    status: 'success',
    user,
    message: 'Успешно изменили номер телефона',
  });
});

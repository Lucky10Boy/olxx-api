const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
  },
  verified: false,
  password: {
    type: String,
    required: [true, 'User must have a password'],
    select: false,
  },
  phoneNumber: {
    type: String,
  },
  avatarPhoto: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'seller'],
    default: 'seller',
  },
  favorites: { type: Array },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationCode: String,
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp === changedTimestamp; // 300 < 200;
  }

  // FALSE MEANS NOT CHANGED
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const generateRandomDigits = (n) => {
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};
userSchema.methods.createEmailVerificationCode = function () {
  const emailVerificationCode = generateRandomDigits(5);
  this.emailVerificationCode = emailVerificationCode;
  return emailVerificationCode;
};
const User = mongoose.model('User', userSchema);
module.exports = User;

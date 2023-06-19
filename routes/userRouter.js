const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/utils');

const router = express.Router();

router.route('/user/register/complete').post(userController.registerComplete);
router.route('/user/register').post(userController.register);
router.route('/user/login').post(userController.login);
router.route('/user/forgot/password').post(userController.forgotPassword);
router.route('/user/edit/phonenumber').post(userController.editPhoneNumber);
router.route('/user/edit/password').patch(userController.editPassword);
router
  .route('/user/reset/password/:passwordResetToken')
  .post(userController.resetPassword);
router.route('/user/favorites').post(protect, userController.addToFavorites);

module.exports = router;

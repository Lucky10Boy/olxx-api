const cloudinary = require('cloudinary');

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// req.files.file.path
exports.uploadProductImages = async (req, res) => {
  try {
    let result = await cloudinary.v2.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto', // jpeg, png
      folder: 'product',
      use_filename: true,
    });
    res.json({
      status: 'success',
      message: 'Фото успешно загружено',
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (error) {
    res.json({ status: 'fail', message: error });
  }
};

exports.remove = async (req, res) => {
  await cloudinary.v2.uploader.destroy(req.body.image_id);
  res.json({
    status: 'success',
    message: 'Фото успешно удалено!',
  });
};

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Категория должна иметь имя'],
    minlength: [3, 'Очень коротко'],
    maxlength: [32, 'Очень длинно'],
  },
  image: String,
  slug: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  subCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Sub',
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Категория должна иметь имя'],
    minlength: [3, 'Очень коротко'],
    maxlength: [50, 'Очень длинно'],
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  parentCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  superSubCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SuperSubCategory',
    },
  ],
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;

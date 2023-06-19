const mongoose = require('mongoose');

const superSubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Категория должна иметь имя'],
    minlength: [2, 'Очень коротко'],
    maxlength: [50, 'Очень длинно'],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  parentSubCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'SubCategory',
  },
});

const SuperSubCategory = mongoose.model(
  'SuperSubCategory',
  superSubCategorySchema
);
module.exports = SuperSubCategory;

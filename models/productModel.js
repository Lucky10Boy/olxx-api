const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'SubCategory',
    },
    images: {
      type: Array,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    superSubCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SuperSubCategory',
        required: false,
      },
    ],

    desc: String,
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    quantity: Number,
  },
  { timestamps: true }
);

productSchema.index({ name: 'text' });

const Product = mongoose.model('Product', productSchema);
Product.createIndexes();
module.exports = Product;

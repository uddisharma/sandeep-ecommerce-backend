const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    image:        { type: Array, required: true },
    category:    { type: String , required: true},
    subCategory: { type: String, required: true },
    size:        { type: Array, required: true },
    bestseller:   { type: Boolean, default: false },
    date: { type: Number, default: Date.now }
  },
  { timestamps: true } 
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

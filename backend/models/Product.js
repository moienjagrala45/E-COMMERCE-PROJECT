const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than 0"],
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    // PRODUCT STOCK
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },

    // PRODUCT SHOW / HIDE
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    productSchema
  );

module.exports = Product;
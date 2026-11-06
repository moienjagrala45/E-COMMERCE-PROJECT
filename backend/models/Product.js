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
      max: [25000, "Price cannot exceed ₹25,000"],
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

    // EXTENDED PRODUCT DETAILS & SPECIFICATIONS
    description: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

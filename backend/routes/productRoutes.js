const express = require("express");

const router = express.Router();

const Product = require("../models/Product");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  admin,
} = require("../middleware/adminMiddleware");


// =========================================
// CREATE PRODUCT - ADMIN ONLY
// =========================================

router.post(
  "/",
  protect,
  admin,
  async (req, res) => {
    try {
      const { name, category, price, image } = req.body;

      // Check required fields - no empty strings
      if (
        !name ||
        !name.toString().trim() ||
        !category ||
        !category.toString().trim() ||
        !image ||
        !image.toString().trim()
      ) {
        return res.status(400).json({
          message: "Name, category, and image are required and cannot be empty",
        });
      }

      // Check price - must be a number greater than 0
      const numPrice = Number(price);
      if (
        price === undefined ||
        price === null ||
        isNaN(numPrice) ||
        numPrice <= 0
      ) {
        return res.status(400).json({
          message: "Price must be a number greater than 0",
        });
      }

      // Check stock if provided
      let cleanStock = 1;
      if (req.body.stock !== undefined) {
        const numStock = Number(req.body.stock);
        if (isNaN(numStock) || numStock < 0) {
          return res.status(400).json({
            message: "Stock must be a non-negative number",
          });
        }
        cleanStock = numStock;
      }

      const product =
        await Product.create({
          ...req.body,
          name: name.toString().trim(),
          category: category.toString().trim(),
          price: numPrice,
          image: image.toString().trim(),
          stock: cleanStock,
          isVisible:
            req.body.isVisible !== undefined
              ? req.body.isVisible
              : true,
        });

      res.status(201).json(
        product
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);


// =========================================
// GET ALL PRODUCTS - PUBLIC
// ONLY VISIBLE PRODUCTS
// =========================================

router.get(
  "/",
  async (req, res) => {
    try {

      const products =
        await Product.find({
          isVisible: {
            $ne: false,
          },
        });

      res.status(200).json(
        products
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);


// =========================================
// GET ALL PRODUCTS - ADMIN
// INCLUDING HIDDEN PRODUCTS
// =========================================

router.get(
  "/admin/all",
  protect,
  admin,
  async (req, res) => {
    try {

      const products =
        await Product.find();

      res.status(200).json(
        products
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);


// =========================================
// GET SINGLE PRODUCT BY ID
// =========================================

router.get(
  "/:id",
  async (req, res) => {
    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });

      }

      res.status(200).json(
        product
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);


// =========================================
// UPDATE PRODUCT - ADMIN ONLY
// =========================================

router.put(
  "/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      if (req.body.price !== undefined) {
        const numPrice = Number(req.body.price);
        if (isNaN(numPrice) || numPrice <= 0) {
          return res.status(400).json({
            message: "Price must be a number greater than 0",
          });
        }
        req.body.price = numPrice;
      }

      if (req.body.name !== undefined && !req.body.name.toString().trim()) {
        return res.status(400).json({
          message: "Product name cannot be empty",
        });
      }

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });

      }

      res.status(200).json(
        product
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);


// =========================================
// SHOW / HIDE PRODUCT - ADMIN ONLY
// =========================================

router.put(
  "/:id/visibility",
  protect,
  admin,
  async (req, res) => {
    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });

      }

      product.isVisible =
        !product.isVisible;

      await product.save();

      res.status(200).json({
        message:
          product.isVisible
            ? "Product is now visible"
            : "Product is now hidden",

        product:
          product,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message ||
          "Failed to update product visibility",
      });

    }
  }
);


// =========================================
// DELETE PRODUCT - ADMIN ONLY
// =========================================

router.delete(
  "/:id",
  protect,
  admin,
  async (req, res) => {
    try {

      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });

      }

      res.status(200).json({
        message:
          "Product deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);


module.exports =
  router;
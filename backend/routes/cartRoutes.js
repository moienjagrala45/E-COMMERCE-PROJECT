const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// ADD PRODUCT TO CART
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // If cart does not exist, create one
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity: quantity || 1,
          },
        ],
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Product already in cart → increase quantity
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        // Add new product
        cart.items.push({
          product: productId,
          quantity: quantity || 1,
        });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET USER CART
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        items: [],
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE PRODUCT QUANTITY IN CART
router.put("/update/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Check quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Find product in cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    // Update quantity
    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Product quantity updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// REMOVE PRODUCT FROM CART
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Remove product from cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
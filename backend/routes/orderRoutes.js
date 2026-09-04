const express = require("express");

const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  admin,
} = require("../middleware/adminMiddleware");


/* =====================================================
   CREATE ORDER
===================================================== */

router.post(
  "/",

  protect,

  async (req, res) => {

    try {

      const {
        items,
        shippingAddress,
      } = req.body;


      /* =============================================
         VALIDATE SHIPPING ADDRESS
      ============================================= */

      if (
        !shippingAddress ||
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.pincode
      ) {

        return res.status(400).json({

          message:
            "Please fill all delivery details",

        });

      }


      /* =============================================
         VALIDATE ITEMS
      ============================================= */

      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          message:
            "No products found in your order",

        });

      }


      /* =============================================
         FIND USER
      ============================================= */

      const user =
        await User.findById(
          req.user._id
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }


      /* =============================================
         PREPARE ADDRESS
      ============================================= */

      const savedAddress = {

        fullName:
          shippingAddress.fullName.trim(),

        phone:
          shippingAddress.phone.trim(),

        address:
          shippingAddress.address.trim(),

        city:
          shippingAddress.city.trim(),

        state:
          shippingAddress.state.trim(),

        pincode:
          shippingAddress.pincode.trim(),

      };


      /* =============================================
         SAVE ADDRESS IN USER
      ============================================= */

      user.address =
        savedAddress;

      await user.save();


      /* =============================================
         CREATE ORDER ITEMS
      ============================================= */

      let totalPrice = 0;

      const orderItems = [];


      for (
        const item of items
      ) {

        /* =========================================
           VALIDATE PRODUCT ID
        ========================================= */

        if (!item.product) {

          return res.status(400).json({

            message:
              "Invalid product",

          });

        }


        /* =========================================
           FIND PRODUCT
        ========================================= */

        const product =
          await Product.findById(
            item.product
          );


        if (!product) {

          return res.status(404).json({

            message:
              "Product not found",

          });

        }


        /* =========================================
           QUANTITY
        ========================================= */

        const quantity =
          Number(
            item.quantity
          ) || 1;


        if (
          quantity < 1
        ) {

          return res.status(400).json({

            message:
              "Invalid quantity",

          });

        }


        /* =========================================
           CALCULATE TOTAL
        ========================================= */

        totalPrice +=

          Number(
            product.price
          ) *

          quantity;


        /* =========================================
           ADD ORDER ITEM
        ========================================= */

        orderItems.push({

          product:
            product._id,

          quantity:
            quantity,

        });

      }


      /* =============================================
         CREATE ORDER
      ============================================= */

      const order =
        await Order.create({

          user:
            req.user._id,

          items:
            orderItems,

          shippingAddress:
            savedAddress,

          totalPrice:
            totalPrice,

          status:
            "Pending",

        });


      /* =============================================
         GET COMPLETE ORDER
         IMPORTANT FOR SUCCESS PAGE
      ============================================= */

      const completeOrder =
        await Order.findById(
          order._id
        )

          .populate(
            "items.product",
            "name price image"
          )

          .populate(
            "user",
            "name email"
          );


      /* =============================================
         CLEAR DATABASE CART
      ============================================= */

      const cart =
        await Cart.findOne({

          user:
            req.user._id,

        });


      if (cart) {

        cart.items = [];

        await cart.save();

      }


      /* =============================================
         SUCCESS RESPONSE
      ============================================= */

      return res.status(201).json({

        success:
          true,

        message:
          "Order placed successfully",

        order:
          completeOrder,

      });


    } catch (error) {

      console.error(
        "Create order error:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to place order",

      });

    }

  }

);


/* =====================================================
   GET MY ORDERS
===================================================== */

router.get(

  "/",

  protect,

  async (req, res) => {

    try {

      const orders =
        await Order.find({

          user:
            req.user._id,

        })

          .populate(
            "items.product",
            "name price image"
          )

          .sort({

            createdAt:
              -1,

          });


      return res.status(200).json(
        orders
      );


    } catch (error) {

      console.error(
        "Fetch user orders error:",
        error
      );


      return res.status(500).json({

        message:
          error.message ||
          "Failed to fetch orders",

      });

    }

  }

);


/* =====================================================
   GET ALL ORDERS - ADMIN
===================================================== */

router.get(

  "/admin/all",

  protect,

  admin,

  async (req, res) => {

    try {

      const orders =
        await Order.find({})

          .populate(

            "user",

            "name email"

          )

          .populate(

            "items.product",

            "name price image"

          )

          .sort({

            createdAt:
              -1,

          });


      return res.status(200).json(
        orders
      );


    } catch (error) {

      console.error(
        "Fetch admin orders error:",
        error
      );


      return res.status(500).json({

        message:
          error.message ||
          "Failed to fetch admin orders",

      });

    }

  }

);


/* =====================================================
   UPDATE ORDER STATUS - ADMIN
===================================================== */

router.put(

  "/:id/status",

  protect,

  admin,

  async (req, res) => {

    try {

      const {
        status,
      } = req.body;


      const allowedStatus = [

        "Pending",

        "Processing",

        "Shipped",

        "Delivered",

      ];


      if (
        !allowedStatus.includes(
          status
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order status",

        });

      }


      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res.status(404).json({

          message:
            "Order not found",

        });

      }


      order.status =
        status;


      await order.save();


      const updatedOrder =
        await Order.findById(
          order._id
        )

          .populate(
            "items.product",
            "name price image"
          )

          .populate(
            "user",
            "name email"
          );


      return res.status(200).json({

        success:
          true,

        message:
          "Order status updated successfully",

        order:
          updatedOrder,

      });


    } catch (error) {

      console.error(
        "Update order status error:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to update order status",

      });

    }

  }

);


module.exports =
  router;
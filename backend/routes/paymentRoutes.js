const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const razorpay = require("../config/razorpay");
const Product = require("../models/Product");

const { protect } = require("../middleware/authMiddleware");


/* =====================================================
   CREATE RAZORPAY ORDER
===================================================== */

router.post(
  "/create-order",
  protect,
  async (req, res) => {
    try {
      const { items } = req.body;

      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          message: "No products found",
        });
      }

      let totalPrice = 0;

      /* =============================================
         CALCULATE TOTAL FROM DATABASE
         NEVER TRUST FRONTEND PRICE
      ============================================= */

      for (const item of items) {
        if (!item.product) {
          return res.status(400).json({
            message: "Invalid product",
          });
        }

        const quantity =
          Number(item.quantity) || 1;

        if (quantity < 1) {
          return res.status(400).json({
            message: "Invalid quantity",
          });
        }

        const product =
          await Product.findById(
            item.product
          );

        if (!product) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        if (
          product.stock === undefined ||
          product.stock < quantity
        ) {
          return res.status(400).json({
            message:
              `${product.name} is out of stock`,
          });
        }

        totalPrice +=
          Number(product.price) *
          quantity;
      }


      /* =============================================
         RAZORPAY AMOUNT
         
         ₹1 = 100 paise
      ============================================= */

      const amountInPaise =
        Math.round(
          totalPrice * 100
        );


      /* =============================================
         CREATE RAZORPAY ORDER
      ============================================= */

      const razorpayOrder =
        await razorpay.orders.create({

          amount:
            amountInPaise,

          currency:
            "INR",

          receipt:
            `shopease_${Date.now()}`,

        });


      return res.status(201).json({

        success:
          true,

        keyId:
          process.env.RAZORPAY_KEY_ID,

        orderId:
          razorpayOrder.id,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

      });

    } catch (error) {

      console.error(
        "Create Razorpay order error:",
        error
      );

      return res.status(500).json({

        message:
          error.message ||
          "Failed to create Razorpay order",

      });

    }
  }
);


/* =====================================================
   VERIFY RAZORPAY PAYMENT
===================================================== */

router.post(
  "/verify",
  protect,
  async (req, res) => {

    try {

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;


      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {

        return res.status(400).json({

          message:
            "Payment verification data is incomplete",

        });

      }


      /* =============================================
         CREATE SIGNATURE
      ============================================= */

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");


      /* =============================================
         COMPARE SIGNATURES
      ============================================= */

      const isSignatureValid =
        crypto.timingSafeEqual(
          Buffer.from(
            generatedSignature
          ),
          Buffer.from(
            razorpay_signature
          )
        );


      if (!isSignatureValid) {

        return res.status(400).json({

          success:
            false,

          message:
            "Invalid payment signature",

        });

      }


      /* =============================================
         PAYMENT VERIFIED
      ============================================= */

      return res.status(200).json({

        success:
          true,

        message:
          "Payment verified successfully",

        paymentId:
          razorpay_payment_id,

        orderId:
          razorpay_order_id,

      });

    } catch (error) {

      console.error(
        "Payment verification error:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          "Payment verification failed",

      });

    }

  }
);


module.exports =
  router;
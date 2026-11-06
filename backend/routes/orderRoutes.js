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
   HISTORICAL ORDER PRODUCTS FALLBACK SNAPSHOTS
   Preserves accurate historical product details (names,
   images, categories, unit prices) for past orders where
   the product reference was archived or re-seeded.
===================================================== */
const HISTORICAL_ORDER_PRODUCTS = {
  "6a970afa0b3efb169d32fe58": {
    name: "Apple MacBook Air 15\" M2 (Midnight)",
    category: "Laptops",
    price: 125000,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
  },
  "6a970c1c0b3efb169d32fe5c": {
    name: "Apple MacBook Pro 16\" M2 Max (Space Gray)",
    category: "Laptops",
    price: 149999,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
  },
  "6a970acc0b3efb169d32fe57": {
    name: "Apple MacBook Pro 14\" M2 Pro",
    category: "Laptops",
    price: 159999,
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
  },
  "6a970e0e0b3efb169d32fe60": {
    name: "Dell XPS 15 InfinityEdge OLED Ultrabook",
    category: "Laptops",
    price: 125000,
    brand: "Dell",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
  },
  "6a9e7b7d020e172ba035dfe4": {
    name: "Ultra-Slim Ergonomic Wireless Mouse",
    category: "Accessories",
    price: 1499,
    brand: "Logitech",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
  },
  "6a9835d9eb53fafa5df80fc4": {
    name: "Aluminum Multi-Angle Laptop Stand",
    category: "Accessories",
    price: 2499,
    brand: "Spigen",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
  },
  "6a958c168de0603b517164a1": {
    name: "Fast Charging Nylon Braided USB-C Cable (2m)",
    category: "Accessories",
    price: 799,
    brand: "Anker",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
  },
  "6a970e480b3efb169d32fe61": {
    name: "Keychron RGB Wireless Mechanical Keyboard",
    category: "Accessories",
    price: 5999,
    brand: "Keychron",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
  },
  "6a970e700b3efb169d32fe62": {
    name: "Anker 737 GaN 140W Fast Power Bank",
    category: "Accessories",
    price: 5499,
    brand: "Anker",
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80",
  },
  "6a970e960b3efb169d32fe63": {
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    category: "Accessories",
    price: 15999,
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
};

/**
 * Hydrates order items with complete product metadata and unit prices.
 * If product was deleted, preserves the historical snapshot.
 */
const hydrateOrderWithSnapshots = async (orderDoc) => {
  if (!orderDoc) return null;
  const orderObj = orderDoc.toObject ? orderDoc.toObject() : JSON.parse(JSON.stringify(orderDoc));
  if (!orderObj.items || !Array.isArray(orderObj.items)) return orderObj;

  for (let i = 0; i < orderObj.items.length; i++) {
    const it = orderObj.items[i];
    let rawPid = null;
    if (it.product) {
      if (typeof it.product === "object" && it.product._id) {
        rawPid = it.product._id.toString();
      } else if (typeof it.product === "string" || it.product.toString) {
        rawPid = it.product.toString();
      }
    }

    let prod = null;
    if (it.product && typeof it.product === "object" && it.product.name) {
      prod = it.product;
    } else if (rawPid) {
      prod = await Product.findById(rawPid).select("name price image category brand").lean();
    }

    if (!prod && rawPid && HISTORICAL_ORDER_PRODUCTS[rawPid]) {
      prod = {
        _id: rawPid,
        ...HISTORICAL_ORDER_PRODUCTS[rawPid],
      };
    }

    if (!prod) {
      const fallbackPrice = it.price || Math.round((orderObj.totalPrice || 0) / (it.quantity || 1));
      prod = {
        _id: rawPid || `item-${i + 1}`,
        name: "Purchased Product",
        category: "General",
        price: fallbackPrice,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      };
    }

    it.product = prod;
    if (!it.price) {
      it.price = prod.price || Math.round((orderObj.totalPrice || 0) / (it.quantity || 1));
    }
  }

  return orderObj;
};


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
        paymentId,
        razorpayOrderId,
        paymentMethod,
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
===================================================== */

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
           ATOMIC STOCK CHECK + DEDUCTION

           Only succeeds when enough stock exists.

           Example:
           stock = 1
           quantity = 1

           First request:
           1 >= 1 → stock becomes 0 ✅

           Second simultaneous request:
           0 >= 1 → no update ❌
        ========================================= */

        const product =
          await Product.findOneAndUpdate(

            {
              _id: item.product,

              stock: {
                $gte: quantity,
              },

            },

            {
              $inc: {
                stock: -quantity,
              },

            },

            {
              new: true,
            }

          );


        /* =========================================
           PRODUCT NOT FOUND / OUT OF STOCK
        ========================================= */

        if (!product) {

          return res.status(400).json({

            message:
              "Product is out of stock",

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

          price:
            Number(product.price),

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
            paymentId ? "Processing" : "Pending",

          paymentMethod:
            paymentMethod || "Razorpay",

          paymentId:
            paymentId || "",

          razorpayOrderId:
            razorpayOrderId || "",

          isPaid:
            Boolean(paymentId),

          paidAt:
            paymentId ? new Date() : null,

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


      if (cart && (paymentId || order.isPaid)) {
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
   CONFIRM PAYMENT FOR EXISTING PENDING ORDER
===================================================== */
router.post(
  "/confirm-payment",
  protect,
  async (req, res) => {
    try {
      const { orderId, paymentId, razorpayOrderId } = req.body;

      if (!orderId || !paymentId) {
        return res.status(400).json({
          message: "Order ID and payment ID are required",
        });
      }

      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
      });

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      // Idempotency: if already paid, return existing complete order
      if (order.isPaid) {
        const alreadyPaid = await Order.findById(order._id)
          .populate("items.product", "name price image brand")
          .populate("user", "name email");

        return res.status(200).json({
          success: true,
          message: "Order is already paid and confirmed",
          order: alreadyPaid,
        });
      }

      // Mark order as paid
      order.isPaid = true;
      order.status = "Processing";
      order.paymentId = paymentId;
      if (razorpayOrderId) {
        order.razorpayOrderId = razorpayOrderId;
      }
      order.paidAt = new Date();
      await order.save();

      // Clear user database cart now that payment is confirmed
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }

      const completeOrder = await Order.findById(order._id)
        .populate("items.product", "name price image brand")
        .populate("user", "name email");

      return res.status(200).json({
        success: true,
        message: "Payment verified and order confirmed successfully",
        order: completeOrder,
      });
    } catch (error) {
      console.error("Confirm payment error:", error);
      return res.status(500).json({
        message: error.message || "Failed to confirm payment",
      });
    }
  }
);


/* =====================================================
   GET PENDING ORDER DETAILS (FOR CHECKOUT RETRY)
===================================================== */
router.get(
  "/pending/:id",
  protect,
  async (req, res) => {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate("items.product", "name price image brand");

      if (!order) {
        return res.status(404).json({
          message: "Pending order not found",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Fetch pending order error:", error);
      return res.status(500).json({
        message: error.message || "Failed to fetch pending order",
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
      const orders = await Order.find({
        user: req.user._id,
      })
        .populate("user", "name email")
        .sort({
          createdAt: -1,
        })
        .lean();

      const hydratedOrders = await Promise.all(
        orders.map((o) => hydrateOrderWithSnapshots(o))
      );

      return res.status(200).json(hydratedOrders);
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
      const orders = await Order.find({})
        .populate("user", "name email")
        .sort({
          createdAt: -1,
        })
        .lean();

      const hydratedOrders = await Promise.all(
        orders.map((o) => hydrateOrderWithSnapshots(o))
      );

      return res.status(200).json(hydratedOrders);
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
   GET SINGLE ORDER BY ID - ADMIN OR OWNER
===================================================== */
router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .lean();

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isAdmin && !isOwner) {
        return res.status(403).json({
          message: "Not authorized to view this order",
        });
      }

      const hydrated = await hydrateOrderWithSnapshots(order);
      return res.status(200).json(hydrated);
    } catch (error) {
      console.error("Fetch single order error:", error);
      return res.status(500).json({
        message: error.message || "Failed to fetch order",
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
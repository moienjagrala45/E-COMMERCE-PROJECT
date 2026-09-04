const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");


/* =====================================================
   GET ADMIN DASHBOARD STATISTICS
===================================================== */

router.get(
  "/stats",
  protect,
  admin,

  async (req, res) => {
    try {

      const totalProducts =
        await Product.countDocuments();

      const totalOrders =
        await Order.countDocuments();

      const totalUsers =
        await User.countDocuments();

      const revenueResult =
        await Order.aggregate([
          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum: "$totalPrice",
              },
            },
          },
        ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0;

      res.status(200).json({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      });

    } catch (error) {

      console.error(
        "Dashboard stats error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch dashboard statistics",
      });

    }
  }
);


module.exports = router;
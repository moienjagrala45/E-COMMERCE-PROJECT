const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

/* =====================================================
   GET ADMIN DASHBOARD STATISTICS (REAL DATABASE VALUES)
===================================================== */
router.get("/stats", protect, admin, async (req, res) => {
  try {
    // 1. Total Active Products (customer catalog)
    const totalProducts = await Product.countDocuments({
      isVisible: { $ne: false },
    });

    // 2. Total Orders (all customer orders placed)
    const totalOrders = await Order.countDocuments();

    // 3. Total Customers (registered accounts, excluding admin)
    const totalCustomers = await User.countDocuments({
      role: { $ne: "admin" },
    });

    const totalUsers = await User.countDocuments();

    // 4. Total Revenue (strictly from verified paid orders)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          status: { $ne: "Cancelled" },
        },
      },
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
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Verified paid orders count
    const paidOrdersCount = await Order.countDocuments({
      isPaid: true,
      status: { $ne: "Cancelled" },
    });

    // 5. Recent Orders (latest orders with populated details)
    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price image brand")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // 6. Low Stock Products (stock between 0 and 5, active catalog)
    const lowStockProducts = await Product.find({
      isVisible: { $ne: false },
      stock: { $lte: 5 },
    })
      .select("name brand category price stock image")
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    // 7. Category Product Breakdown (active catalog)
    const categoryDistribution = await Product.aggregate([
      { $match: { isVisible: { $ne: false } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 8. Real Sales Timeline (grouped by date from verified paid orders only)
    const salesTimeline = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 14 },
    ]);

    // 9. Out of stock products count (real database count)
    const outOfStockCount = await Product.countDocuments({
      isVisible: { $ne: false },
      stock: 0,
    });

    // 10. Total active categories count
    const totalCategories = categoryDistribution.length;

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalUsers,
      totalRevenue,
      paidOrdersCount,
      outOfStockCount,
      totalCategories,
      recentOrders,
      lowStockProducts,
      categoryDistribution,
      salesTimeline,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
});

module.exports = router;

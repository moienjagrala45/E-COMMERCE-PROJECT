const express = require("express");
const router = express.Router();

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  admin,
} = require("../middleware/adminMiddleware");


/* =====================================================
   REGISTER USER
===================================================== */

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password,
    } = req.body;


    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }


    // Check existing user
    const userExists =
      await User.findOne({
        email: email.toLowerCase(),
      });


    if (userExists) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }


    // Create user
    const user =
      await User.create({
        name,
        email,
        password,
      });


    res.status(201).json({

      message:
        "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });

  } catch (error) {

    console.error(
      "Register user error:",
      error
    );


    res.status(500).json({
      message:
        error.message ||
        "Something went wrong while registering",
    });

  }
});


/* =====================================================
   LOGIN USER / ADMIN
===================================================== */

router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }


    // Find user
    const user =
      await User.findOne({
        email: email.toLowerCase(),
      });


    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }


    // Check password
    const isMatch =
      await user.comparePassword(
        password
      );


    if (!isMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }


    // Create JWT
    const token =
      jwt.sign(

        {
          id: user._id,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }

      );


    res.status(200).json({

      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        address: user.address,
      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );


    res.status(500).json({
      message:
        error.message ||
        "Something went wrong during login",
    });

  }
});


/* =====================================================
   GET SAVED SHIPPING ADDRESS
===================================================== */

router.get(
  "/address",

  protect,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).select(
          "-password"
        );


      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }


      res.status(200).json({

        message:
          "Address fetched successfully",

        address:
          user.address,

      });

    } catch (error) {

      console.error(
        "Get address error:",
        error
      );


      res.status(500).json({
        message:
          "Failed to fetch address",
      });

    }

  }
);


/* =====================================================
   SAVE / UPDATE SHIPPING ADDRESS
===================================================== */

router.put(
  "/address",

  protect,

  async (req, res) => {

    try {

      const {

        fullName,
        phone,
        address,
        city,
        state,
        pincode,

      } = req.body;


      // Validate all fields
      if (
        !fullName ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !pincode
      ) {

        return res.status(400).json({

          message:
            "Please fill all address details",

        });

      }


      // Find logged in user
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


      // Save address permanently
      user.address = {

        fullName:
          fullName.trim(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        city:
          city.trim(),

        state:
          state.trim(),

        pincode:
          pincode.trim(),

      };


      await user.save();


      res.status(200).json({

        message:
          "Address saved successfully",

        address:
          user.address,

      });

    } catch (error) {

      console.error(
        "Save address error:",
        error
      );


      res.status(500).json({

        message:
          error.message ||
          "Failed to save address",

      });

    }

  }
);


/* =====================================================
   PROTECTED USER PROFILE
===================================================== */

router.get(

  "/profile",

  protect,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).select(
          "-password"
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }


      res.status(200).json({

        message:
          "Welcome to your profile",

        user,

      });

    } catch (error) {

      console.error(
        "Profile error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to fetch profile",

      });

    }

  }

);


/* =====================================================
   GET ALL USERS - ADMIN ONLY
===================================================== */

router.get(

  "/admin/all",

  protect,

  admin,

  async (req, res) => {

    try {

      const users =
        await User.find()

          .select(
            "-password"
          )

          .sort({
            createdAt: -1,
          });


      res.status(200).json(
        users
      );

    } catch (error) {

      console.error(
        "Fetch users error:",
        error
      );


      res.status(500).json({

        message:
          error.message,

      });

    }

  }

);


/* =====================================================
   MAKE USER ADMIN - ADMIN ONLY
===================================================== */

router.put(

  "/make-admin/:id",

  protect,

  admin,

  async (req, res) => {

    try {

      const user =
        await User.findByIdAndUpdate(

          req.params.id,

          {
            role:
              "admin",
          },

          {
            new: true,
          }

        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }


      res.status(200).json({

        message:
          "User is now an admin",

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

        },

      });

    } catch (error) {

      console.error(
        "Make admin error:",
        error
      );


      res.status(500).json({

        message:
          error.message,

      });

    }

  }

);


/* =====================================================
   DELETE USER - ADMIN ONLY
===================================================== */

router.delete(

  "/admin/:id",

  protect,

  admin,

  async (req, res) => {

    try {

      // Prevent admin deleting themselves
      if (

        req.user._id.toString() ===
        req.params.id

      ) {

        return res.status(400).json({

          message:
            "You cannot delete your own account",

        });

      }


      const user =
        await User.findByIdAndDelete(
          req.params.id
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }


      res.status(200).json({

        message:
          "User deleted successfully",

      });

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );


      res.status(500).json({

        message:
          error.message,

      });

    }

  }

);


module.exports = router;
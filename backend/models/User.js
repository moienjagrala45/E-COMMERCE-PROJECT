const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
  {
    // ================= NAME =================

    name: {
      type: String,
      required: true,
      trim: true,
    },


    // ================= EMAIL =================

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },


    // ================= PASSWORD =================

    password: {
      type: String,
      required: true,
      minlength: 6,
    },


    // ================= ROLE =================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },


    // ================= SAVED SHIPPING ADDRESS =================

    address: {
      fullName: {
        type: String,
        trim: true,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      state: {
        type: String,
        trim: true,
        default: "",
      },

      pincode: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },

  {
    timestamps: true,
  }
);


// ================= PASSWORD HASH =================

userSchema.pre(
  "save",

  async function () {
    if (!this.isModified("password")) {
      return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );
  }
);


// ================= COMPARE PASSWORD =================

userSchema.methods.comparePassword =
  async function (enteredPassword) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };


// ================= EXPORT MODEL =================

module.exports =
  mongoose.model(
    "User",
    userSchema
  );
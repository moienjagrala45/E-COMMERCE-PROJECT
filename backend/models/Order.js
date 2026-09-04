const mongoose = require("mongoose");


const orderItemSchema = new mongoose.Schema(
  {

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

  },

  {
    _id: false,
  }
);


const shippingAddressSchema = new mongoose.Schema(
  {

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

  },

  {
    _id: false,
  }
);


const orderSchema = new mongoose.Schema(

  {

    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },


    items: [

      orderItemSchema,

    ],


    shippingAddress:

      shippingAddressSchema,


    totalPrice: {

      type: Number,

      required: true,

      default: 0,

    },


    status: {

      type: String,

      enum: [

        "Pending",

        "Processing",

        "Shipped",

        "Delivered",

      ],

      default: "Pending",

    },

  },


  {

    timestamps: true,

  }

);


const Order =

  mongoose.models.Order ||

  mongoose.model(

    "Order",

    orderSchema

  );


module.exports =

  Order;
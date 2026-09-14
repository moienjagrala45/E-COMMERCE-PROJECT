const Razorpay = require("razorpay");

const keyId =
  (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.trim()) ||
  "rzp_test_TZBPMd925Dl14D";

const keySecret =
  (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET.trim()) ||
  "f7RuFJJybUsMAKs0tizh9sQn";

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

module.exports = {
  razorpay,
  keyId,
  keySecret,
};
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    clearCart,
  } = useContext(CartContext);

  const [checkoutItems, setCheckoutItems] =
    useState([]);

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [state, setState] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const API_URL =
    "https://e-commerce-project-backend-vpdz.onrender.com";


  /* =====================================================
     LOAD CART ITEMS
  ===================================================== */

  useEffect(() => {
    try {
      const savedCheckoutItems =
        JSON.parse(
          localStorage.getItem(
            "checkoutItems"
          )
        );

      if (
        savedCheckoutItems &&
        Array.isArray(savedCheckoutItems) &&
        savedCheckoutItems.length > 0
      ) {
        setCheckoutItems(
          savedCheckoutItems
        );
      } else if (
        cartItems &&
        cartItems.length > 0
      ) {
        setCheckoutItems(
          cartItems
        );
      }

    } catch (error) {
      console.error(
        "Checkout items error:",
        error
      );
    }
  }, [cartItems]);


  /* =====================================================
     LOAD SAVED ADDRESS
  ===================================================== */

  useEffect(() => {
    const loadAddress =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) {
            navigate("/login");
            return;
          }

          const response =
            await fetch(
              `${API_URL}/api/users/address`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (
            response.ok &&
            data.address
          ) {

            setFullName(
              data.address.fullName || ""
            );

            setPhone(
              data.address.phone || ""
            );

            setAddress(
              data.address.address || ""
            );

            setCity(
              data.address.city || ""
            );

            setState(
              data.address.state || ""
            );

            setPincode(
              data.address.pincode || ""
            );
          }

        } catch (error) {

          console.error(
            "Load address error:",
            error
          );

        }
      };

    loadAddress();

  }, [navigate]);


  /* =====================================================
     LOAD RAZORPAY SCRIPT
  ===================================================== */

  const loadRazorpayScript =
    () => {

      return new Promise(
        (resolve) => {

          const existingScript =
            document.getElementById(
              "razorpay-checkout-script"
            );

          if (existingScript) {
            resolve(true);
            return;
          }

          const script =
            document.createElement(
              "script"
            );

          script.id =
            "razorpay-checkout-script";

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload =
            () => {
              resolve(true);
            };

          script.onerror =
            () => {
              resolve(false);
            };

          document.body.appendChild(
            script
          );
        }
      );
    };


  /* =====================================================
     PLACE ORDER + RAZORPAY PAYMENT
  ===================================================== */

  const handlePlaceOrder =
    async (e) => {

      e.preventDefault();

      setMessage("");


      /* =============================================
         VALIDATE DELIVERY DETAILS
      ============================================= */

      if (
        !fullName.trim() ||
        !phone.trim() ||
        !address.trim() ||
        !city.trim() ||
        !state.trim() ||
        !pincode.trim()
      ) {

        setMessage(
          "Please fill all delivery details."
        );

        return;
      }


      /* =============================================
         CHECK TOKEN
      ============================================= */

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        navigate("/login");

        return;
      }


      /* =============================================
         CHECK CART
      ============================================= */

      if (
        !checkoutItems ||
        checkoutItems.length === 0
      ) {

        setMessage(
          "Your cart is empty."
        );

        return;
      }


      setLoading(true);


      try {

        /* =========================================
           LOAD RAZORPAY CHECKOUT
        ========================================= */

        const razorpayLoaded =
          await loadRazorpayScript();

        if (!razorpayLoaded) {

          setMessage(
            "Razorpay failed to load. Please check your internet connection."
          );

          return;
        }


        /* =========================================
           CREATE RAZORPAY ORDER
        ========================================= */

        const paymentResponse =
          await fetch(
            `${API_URL}/api/payments/create-order`,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },

              body:
                JSON.stringify({

                  items:
                    checkoutItems.map(
                      (item) => ({

                        product:
                          item._id,

                        quantity:
                          item.quantity || 1,

                      })
                    ),

                }),

            }
          );


        const paymentData =
          await paymentResponse.json();


        console.log(
          "RAZORPAY ORDER RESPONSE:",
          paymentData
        );


        if (!paymentResponse.ok) {

          setMessage(
            paymentData.message ||
            "Failed to create payment order."
          );

          return;
        }


        /* =========================================
           OPEN RAZORPAY CHECKOUT
        ========================================= */

        const options = {

          key:
            paymentData.keyId,

          amount:
            paymentData.amount,

          currency:
            paymentData.currency,

          name:
            "ShopEase",

          description:
            "ShopEase Order Payment",

          order_id:
            paymentData.orderId,

          prefill: {

            name:
              fullName.trim(),

            contact:
              phone.trim(),

          },

          notes: {

            address:
              `${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,

          },


          /* =====================================
             PAYMENT SUCCESS
          ===================================== */

          handler:
            async function (
              razorpayResponse
            ) {

              try {

                setMessage(
                  "Verifying payment..."
                );


                /* =================================
                   VERIFY PAYMENT
                ================================= */

                const verifyResponse =
                  await fetch(
                    `${API_URL}/api/payments/verify`,
                    {

                      method:
                        "POST",

                      headers: {

                        "Content-Type":
                          "application/json",

                        Authorization:
                          `Bearer ${token}`,

                      },

                      body:
                        JSON.stringify({

                          razorpay_order_id:
                            razorpayResponse.razorpay_order_id,

                          razorpay_payment_id:
                            razorpayResponse.razorpay_payment_id,

                          razorpay_signature:
                            razorpayResponse.razorpay_signature,

                        }),

                    }
                  );


                const verifyData =
                  await verifyResponse.json();


                console.log(
                  "PAYMENT VERIFY RESPONSE:",
                  verifyData
                );


                if (!verifyResponse.ok) {

                  setMessage(
                    verifyData.message ||
                    "Payment verification failed."
                  );

                  return;
                }


                /* =================================
                   PAYMENT VERIFIED
                   NOW CREATE SHOP EASE ORDER
                ================================= */

                setMessage(
                  "Payment successful. Placing your order..."
                );


                const orderResponse =
                  await fetch(
                    `${API_URL}/api/orders`,
                    {

                      method:
                        "POST",

                      headers: {

                        "Content-Type":
                          "application/json",

                        Authorization:
                          `Bearer ${token}`,

                      },

                      body:
                        JSON.stringify({

                          items:

                            checkoutItems.map(
                              (item) => ({

                                product:
                                  item._id,

                                quantity:
                                  item.quantity || 1,

                              })
                            ),

                          shippingAddress: {

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

                          },

                        }),

                    }
                  );


                const orderData =
                  await orderResponse.json();


                console.log(
                  "ORDER RESPONSE:",
                  orderData
                );


                if (!orderResponse.ok) {

                  setMessage(
                    orderData.message ||
                    "Payment succeeded but order could not be created."
                  );

                  return;
                }


                /* =================================
                   SAVE ORDER
                ================================= */

                const createdOrder =
                  orderData.order;


                localStorage.setItem(
                  "latestOrder",
                  JSON.stringify(
                    createdOrder
                  )
                );


                /* =================================
                   CLEAR CHECKOUT
                ================================= */

                localStorage.removeItem(
                  "checkoutItems"
                );


                /* =================================
                   CLEAR CART
                ================================= */

                if (
                  typeof clearCart ===
                  "function"
                ) {

                  clearCart();

                }


                /* =================================
                   GO TO SUCCESS PAGE
                ================================= */

                navigate(
                  "/order-success",
                  {

                    replace:
                      true,

                    state: {

                      order:
                        createdOrder,

                    },

                  }
                );


              } catch (error) {

                console.error(
                  "Payment verification error:",
                  error
                );

                setMessage(
                  "Payment verification failed. Please contact support."
                );

              }

            },


          /* =====================================
             PAYMENT FAILED
          ===================================== */

          modal: {

            ondismiss:
              function () {

                setLoading(false);

                setMessage(
                  "Payment cancelled."
                );

              },

          },

          theme: {

            color:
              "#3399cc",

          },

        };


        const razorpay =
          new window.Razorpay(
            options
          );


        razorpay.on(
          "payment.failed",
          function (
            response
          ) {

            console.error(
              "RAZORPAY PAYMENT FAILED:",
              response
            );

            setMessage(
              "Payment failed. Please try again."
            );

            setLoading(false);

          }
        );


        razorpay.open();


      } catch (error) {

        console.error(
          "Place order error:",
          error
        );

        setMessage(
          "Something went wrong. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <section className="checkout-section">

      <div className="checkout-container">

        <div className="checkout-header">

          <div className="checkout-icon">
            📦
          </div>

          <h2>
            Complete Your Order
          </h2>

          <p className="checkout-subtitle">

            Enter your delivery details
            and place your order

          </p>

        </div>


        <form
          className="checkout-form"
          onSubmit={
            handlePlaceOrder
          }
        >


          <div className="checkout-row">

            <div className="input-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="input-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </div>


          <div className="input-group">

            <label>
              Complete Address
            </label>

            <textarea
              placeholder="House No., Street, Area, Landmark"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              required
            />

          </div>


          <div className="checkout-row">

            <div className="input-group">

              <label>
                City
              </label>

              <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="input-group">

              <label>
                State
              </label>

              <input
                type="text"
                placeholder="Enter your state"
                value={state}
                onChange={(e) =>
                  setState(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </div>


          <div className="input-group">

            <label>
              Pincode
            </label>

            <input
              type="text"
              placeholder="Enter your pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(
                  e.target.value
                )
              }
              required
            />

          </div>


          {message && (

            <p className="checkout-message">

              {message}

            </p>

          )}


          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >

            {
              loading
                ? "Opening Payment..."
                : "Pay with Razorpay ✓"
            }

          </button>


        </form>

      </div>

    </section>

  );
}

export default Checkout;
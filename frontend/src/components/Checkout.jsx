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
    "http://192.168.0.101:5000";


  /* ================= LOAD CART ITEMS ================= */

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


  /* ================= LOAD ADDRESS ================= */

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


  /* ================= PLACE ORDER ================= */

  const handlePlaceOrder =
    async (e) => {

      e.preventDefault();

      setMessage("");


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


      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        navigate("/login");

        return;

      }


      setLoading(true);


      try {

        const response =
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


        const data =
          await response.json();


        console.log(
          "ORDER RESPONSE:",
          data
        );


        if (!response.ok) {

          setMessage(
            data.message ||
            "Failed to place order."
          );

          return;

        }


        const createdOrder =
          data.order;


        /* ================= SAVE ORDER ================= */

        localStorage.setItem(

          "latestOrder",

          JSON.stringify(
            createdOrder
          )

        );


        /* ================= CLEAR LOCAL CHECKOUT ================= */

        localStorage.removeItem(
          "checkoutItems"
        );


        /* ================= CLEAR CART ================= */

        if (
          typeof clearCart ===
          "function"
        ) {

          clearCart();

        }


        /* ================= GO TO SUCCESS ================= */

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
          "Place order error:",
          error
        );

        setMessage(
          "Something went wrong. Please try again."
        );

      } finally {

        setLoading(
          false
        );

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
                ? "Placing Order..."
                : "Place Order ✓"
            }

          </button>


        </form>

      </div>

    </section>

  );

}

export default Checkout;
import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CartContext,
} from "../context/CartContext";


function Cart() {

  const navigate =
    useNavigate();


  const {

    cartItems,

    increaseQuantity,

    decreaseQuantity,

    removeFromCart,

  } = useContext(
    CartContext
  );


  /* ================= PRODUCT NAME ================= */

  const getProductName =
    (item) => {

      return (

        item?.name ||

        item?.product?.name ||

        "Product"

      );

    };


  /* ================= PRODUCT PRICE ================= */

  const getProductPrice =
    (item) => {

      return Number(

        item?.price ??

        item?.product?.price ??

        0

      );

    };


  /* ================= EMPTY CART ================= */

  if (
    !cartItems ||
    cartItems.length === 0
  ) {

    return (

      <section className="cart-section">

        <h2>
          Your Cart
        </h2>


        <p className="empty-cart">

          Your cart is empty.

        </p>


        <button

          className="shop-btn"

          onClick={() =>
            navigate("/home")
          }

        >

          Continue Shopping

        </button>

      </section>

    );

  }


  /* ================= TOTAL PRICE ================= */

  const totalPrice =
    cartItems.reduce(

      (total, item) =>

        total +

        getProductPrice(item) *

        Number(
          item.quantity || 1
        ),

      0

    );


  /* ================= PROCEED TO CHECKOUT ================= */

  const handleProceedToCheckout =
    () => {

      try {

        localStorage.setItem(

          "checkoutItems",

          JSON.stringify(
            cartItems
          )

        );


        navigate(
          "/checkout"
        );

      } catch (error) {

        console.error(
          "Checkout error:",
          error
        );

      }

    };


  /* ================= CART UI ================= */

  return (

    <section className="cart-section">

      <h2>
        Your Cart
      </h2>


      <div className="cart-container">


        {cartItems.map(
          (item, index) => {

            const productName =
              getProductName(item);


            const productPrice =
              getProductPrice(item);


            const quantity =
              Number(
                item.quantity || 1
              );


            const itemTotal =
              productPrice *
              quantity;


            return (

              <div

                className="cart-item"

                key={
                  item._id ||
                  index
                }

              >


                <img

                  src={
                    item.image ||
                    item.product?.image
                  }

                  alt={
                    productName
                  }

                  className="cart-image"

                />


                <div className="cart-details">

                  <h3>

                    {productName}

                  </h3>


                  <p>

                    ₹

                    {productPrice.toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>


                <div className="quantity-controls">

                  <button

                    type="button"

                    onClick={() =>

                      decreaseQuantity(
                        item._id
                      )

                    }

                  >

                    −

                  </button>


                  <span>

                    {quantity}

                  </span>


                  <button

                    type="button"

                    onClick={() =>

                      increaseQuantity(
                        item._id
                      )

                    }

                  >

                    +

                  </button>

                </div>


                <p className="cart-item-total">

                  ₹

                  {itemTotal.toLocaleString(
                    "en-IN"
                  )}

                </p>


                <button

                  type="button"

                  className="remove-btn"

                  onClick={() =>

                    removeFromCart(
                      item._id
                    )

                  }

                >

                  Remove

                </button>

              </div>

            );

          }
        )}


        <div className="cart-total">

          <h3>

            Total: ₹

            {totalPrice.toLocaleString(
              "en-IN"
            )}

          </h3>


          <button

            type="button"

            className="checkout-btn"

            onClick={
              handleProceedToCheckout
            }

          >

            Proceed to Checkout

          </button>

        </div>


      </div>

    </section>

  );

}


export default Cart;
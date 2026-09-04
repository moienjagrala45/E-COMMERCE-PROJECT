import {
  useLocation,
  useNavigate,
} from "react-router-dom";


function OrderSuccess() {

  const navigate =
    useNavigate();


  const location =
    useLocation();


  /* ========================================
     GET ORDER
  ======================================== */

  let order =
    location.state?.order;


  /* ========================================
     LOCALSTORAGE FALLBACK
  ======================================== */

  if (!order) {

    const savedOrder =
      localStorage.getItem(
        "latestOrder"
      );


    if (savedOrder) {

      try {

        order =
          JSON.parse(
            savedOrder
          );

      } catch (error) {

        console.error(
          "Order parsing error:",
          error
        );

      }

    }

  }


  /* ========================================
     NO ORDER
  ======================================== */

  if (!order) {

    return (

      <section
        className="order-success-page"
      >

        <div
          className="order-success-card"
        >

          <div
            className="success-header"
          >

            <div
              className="success-icon"
            >
              ⚠️
            </div>


            <h1>
              No Order Found
            </h1>


            <p>
              No order details are available.
            </p>

          </div>


          <button

            className="continue-shopping-btn"

            onClick={() =>
              navigate(
                "/home"
              )
            }

          >

            Continue Shopping →

          </button>

        </div>

      </section>

    );

  }


  /* ========================================
     ORDER DATA
  ======================================== */

  const shippingAddress =
    order.shippingAddress ||
    {};


  const orderItems =
    order.items ||
    order.orderItems ||
    [];


  const totalPrice =
    Number(

      order.totalPrice ??

      order.totalAmount ??

      order.total ??

      0

    );


  const orderStatus =
    order.status ||
    "Pending";


  /* ========================================
     GET PRODUCT NAME
  ======================================== */

  const getProductName =
    (item) => {

      if (
        item.product?.name
      ) {

        return item.product.name;

      }


      if (
        item.name
      ) {

        return item.name;

      }


      if (
        item.productName
      ) {

        return item.productName;

      }


      return "Product";

    };


  /* ========================================
     GET PRODUCT PRICE
  ======================================== */

  const getProductPrice =
    (item) => {

      return Number(

        item.product?.price ??

        item.price ??

        0

      );

    };


  /* ========================================
     GET QUANTITY
  ======================================== */

  const getQuantity =
    (item) => {

      return Number(

        item.quantity ??

        item.qty ??

        1

      );

    };


  return (

    <section
      className="order-success-page"
    >

      <div
        className="order-success-card"
      >


        {/* SUCCESS */}

        <div
          className="success-header"
        >

          <div
            className="success-icon"
          >
            ✓
          </div>


          <h1>
            Order Successful!
          </h1>


          <p>
            Thank you for your order.
          </p>


          <p>
            Your order has been placed successfully.
          </p>

        </div>


        {/* ORDER ID */}

        <div
          className="success-info-box"
        >

          <span>
            Order ID
          </span>


          <strong>

            #

            {
              order._id ||
              order.id ||
              "N/A"
            }

          </strong>

        </div>


        {/* TOTAL */}

        <div
          className="success-info-box"
        >

          <span>
            Total Amount
          </span>


          <strong
            className="success-price"
          >

            ₹

            {
              totalPrice
                .toFixed(2)
            }

          </strong>

        </div>


        {/* STATUS */}

        <div
          className="success-info-box"
        >

          <span>
            Order Status
          </span>


          <strong
            className="status-pending"
          >

            {orderStatus}

          </strong>

        </div>


        {/* ORDER ITEMS */}

        <div
          className="order-products"
        >

          <h3>
            🛍️ Order Items
          </h3>


          {
            orderItems.length === 0

              ? (

                <p>
                  No products found.
                </p>

              )

              : (

                orderItems.map(

                  (
                    item,
                    index
                  ) => {

                    const name =
                      getProductName(
                        item
                      );


                    const price =
                      getProductPrice(
                        item
                      );


                    const quantity =
                      getQuantity(
                        item
                      );


                    const itemTotal =
                      price *
                      quantity;


                    return (

                      <div

                        className="success-product"

                        key={
                          item._id ||
                          item.product?._id ||
                          index
                        }

                      >

                        <div>

                          <strong>
                            {name}
                          </strong>


                          <p>

                            Qty:{" "}

                            {quantity}

                          </p>

                        </div>


                        <strong>

                          ₹

                          {
                            itemTotal
                              .toFixed(2)
                          }

                        </strong>

                      </div>

                    );

                  }

                )

              )
          }

        </div>


        {/* ADDRESS */}

        <div
          className="delivery-address"
        >

          <h3>
            📍 Delivery Address
          </h3>


          <p>

            <strong>

              {
                shippingAddress.fullName ||
                "Customer"
              }

            </strong>

          </p>


          {
            shippingAddress.phone && (

              <p>

                📞{" "}

                {
                  shippingAddress.phone
                }

              </p>

            )
          }


          {
            shippingAddress.address && (

              <p>

                {
                  shippingAddress.address
                }

              </p>

            )
          }


          <p>

            {
              shippingAddress.city
            }

            {
              shippingAddress.city &&
              shippingAddress.state

                ? ", "

                : ""
            }

            {
              shippingAddress.state
            }

          </p>


          {
            shippingAddress.pincode && (

              <p>

                Pincode:{" "}

                {
                  shippingAddress.pincode
                }

              </p>

            )
          }

        </div>


        {/* NOTE */}

        <div
          className="order-note"
        >

          <p>
            📦 Your order is currently being processed.
          </p>

          <p>
            🚚 You will receive delivery updates soon.
          </p>

          <p>
            🧾 Keep your Order ID for future reference.
          </p>

        </div>


        {/* BUTTON */}

        <button

          className="continue-shopping-btn"

          onClick={() =>
            navigate(
              "/home"
            )
          }

        >

          Continue Shopping →

        </button>


      </div>

    </section>

  );

}


export default OrderSuccess;
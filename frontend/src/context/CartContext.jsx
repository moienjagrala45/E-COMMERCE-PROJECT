import {
  createContext,
  useState,
  useRef,
  useEffect,
} from "react";


export const CartContext =
  createContext();


export function CartProvider({
  children,
}) {

  const [
    cartItems,
    setCartItems,
  ] = useState([]);


  const [
    notification,
    setNotification,
  ] = useState("");


  const notificationTimer =
    useRef(null);


  /* ================= CLEANUP TIMER ================= */

  useEffect(() => {

    return () => {

      if (
        notificationTimer.current
      ) {

        clearTimeout(
          notificationTimer.current
        );

      }

    };

  }, []);


  /* ================= ADD TO CART ================= */

  const addToCart =
    (product) => {

      setCartItems(
        (prevItems) => {

          const existingProduct =
            prevItems.find(
              (item) =>
                item._id === product._id
            );


          /* PRODUCT ALREADY EXISTS */

          if (existingProduct) {

            return prevItems.map(
              (item) =>

                item._id === product._id

                  ? {
                      ...item,

                      quantity:
                        Number(
                          item.quantity
                        ) + 1,
                    }

                  : item
            );

          }


          /* NEW PRODUCT */

          return [

            ...prevItems,

            {
              ...product,

              quantity: 1,
            },

          ];

        }
      );


      /* ================= NOTIFICATION ================= */

      if (
        notificationTimer.current
      ) {

        clearTimeout(
          notificationTimer.current
        );

      }


      setNotification(
        product.name || "Product"
      );


      notificationTimer.current =
        setTimeout(
          () => {

            setNotification("");

          },

          3000
        );

    };


  /* ================= INCREASE QUANTITY ================= */

  const increaseQuantity =
    (id) => {

      setCartItems(
        (prevItems) =>

          prevItems.map(
            (item) =>

              item._id === id

                ? {
                    ...item,

                    quantity:
                      Number(
                        item.quantity
                      ) + 1,
                  }

                : item
          )

      );

    };


  /* ================= DECREASE QUANTITY ================= */

  const decreaseQuantity =
    (id) => {

      setCartItems(
        (prevItems) =>

          prevItems

            .map(
              (item) =>

                item._id === id

                  ? {
                      ...item,

                      quantity:
                        Number(
                          item.quantity
                        ) - 1,
                    }

                  : item
            )

            .filter(
              (item) =>
                item.quantity > 0
            )

      );

    };


  /* ================= REMOVE FROM CART ================= */

  const removeFromCart =
    (id) => {

      setCartItems(
        (prevItems) =>

          prevItems.filter(
            (item) =>
              item._id !== id
          )

      );

    };


  /* ================= CLEAR CART ================= */

  const clearCart =
    () => {

      setCartItems([]);

    };


  /* ================= PROVIDER ================= */

  return (

    <CartContext.Provider

      value={{

        cartItems,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        notification,

      }}

    >

      {children}

    </CartContext.Provider>

  );

}
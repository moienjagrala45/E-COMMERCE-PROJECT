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
  // Initialize from localStorage for persistence across refreshes
  const [
    cartItems,
    setCartItems,
  ] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_cart") || localStorage.getItem("cartItems");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Ensure all saved quantities are capped at 2
          return parsed.map((item) => ({
            ...item,
            quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 2),
          }));
        }
      }
    } catch (e) {
      console.error("Error reading cart from localStorage:", e);
    }
    return [];
  });

  const [
    notification,
    setNotification,
  ] = useState("");

  const notificationTimer =
    useRef(null);

  /* ================= PERSIST CART TO LOCALSTORAGE ================= */

  useEffect(() => {
    try {
      localStorage.setItem("shopease_cart", JSON.stringify(cartItems));
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [cartItems]);

  /* ================= CLEANUP TIMER ================= */

  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, []);

  /* ================= GET ITEM QUANTITY HELPER ================= */

  const getItemQuantity = (productId) => {
    const id = typeof productId === "object" ? (productId._id || productId.id) : productId;
    const found = cartItems.find((item) => (item._id || item.id) === id);
    return found ? Number(found.quantity) || 0 : 0;
  };

  const isMaxStockReached = (productId) => {
    return getItemQuantity(productId) >= 2;
  };

  /* ================= ADD TO CART ================= */

  const addToCart = (product) => {
    const pId = product._id || product.id;
    const currentQty = getItemQuantity(pId);

    // Enforce maximum 2 units per individual product
    if (currentQty >= 2) {
      return {
        success: false,
        reason: "MAX_LIMIT_REACHED",
        quantity: currentQty,
      };
    }

    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(
        (item) => (item._id || item.id) === pId
      );

      /* PRODUCT ALREADY EXISTS */
      if (existingProduct) {
        const newQty = Math.min(Number(existingProduct.quantity) + 1, 2);
        return prevItems.map((item) =>
          (item._id || item.id) === pId
            ? {
                ...item,
                quantity: newQty,
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
    });

    /* ================= NOTIFICATION ================= */
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    setNotification(product.name || "Product");

    notificationTimer.current = setTimeout(() => {
      setNotification("");
    }, 3000);

    return {
      success: true,
      quantity: currentQty + 1,
    };
  };

  /* ================= INCREASE QUANTITY ================= */

  const increaseQuantity = (id) => {
    let limitReached = false;
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if ((item._id || item.id) === id) {
          if (Number(item.quantity) >= 2) {
            limitReached = true;
            return item; // strictly capped at 2
          }
          return {
            ...item,
            quantity: Number(item.quantity) + 1,
          };
        }
        return item;
      })
    );
    return !limitReached;
  };

  /* ================= DECREASE QUANTITY ================= */

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          (item._id || item.id) === id
            ? {
                ...item,
                quantity: Number(item.quantity) - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* ================= REMOVE FROM CART ================= */

  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== id)
    );
  };

  /* ================= CLEAR CART ================= */

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem("shopease_cart");
      localStorage.removeItem("cartItems");
    } catch (e) {
      console.error(e);
    }
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
        getItemQuantity,
        isMaxStockReached,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
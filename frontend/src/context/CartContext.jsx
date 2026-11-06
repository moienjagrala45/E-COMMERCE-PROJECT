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
          // Ensure all saved quantities are valid numbers
          return parsed.map((item) => ({
            ...item,
            quantity: Math.max(Number(item.quantity) || 1, 1),
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
    const found = cartItems.find((item) => (item._id || item.id) === productId);
    const maxStock = found?.stock !== undefined ? Number(found.stock) : 99;
    return getItemQuantity(productId) >= maxStock;
  };

  /* ================= ADD TO CART ================= */

  const addToCart = (product) => {
    const pId = product._id || product.id;
    const currentQty = getItemQuantity(pId);
    const maxStock = product.stock !== undefined ? Number(product.stock) : 99;

    // Enforce maximum units per individual product based on available stock
    if (currentQty >= maxStock) {
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
        const newQty = Math.min(Number(existingProduct.quantity) + 1, maxStock);
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
          const maxStock = item.stock !== undefined ? Number(item.stock) : 99;
          if (Number(item.quantity) >= maxStock) {
            limitReached = true;
            return item;
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
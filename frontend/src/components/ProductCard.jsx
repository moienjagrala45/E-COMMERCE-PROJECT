import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const [stockMessage, setStockMessage] = useState("");
  const [checkingStock, setCheckingStock] = useState(false);

  const handleAddToCart = async () => {
    console.log("BUTTON CLICKED");
    console.log("NEW PRODUCT CARD CODE RUNNING");
    console.log("PRODUCT:", product);

    setStockMessage("");
    setCheckingStock(true);

    try {
      // Get the latest product and stock from backend
      const response = await fetch(
        `https://e-commerce-project-backend-vpdz.onrender.com/api/products/${product._id}`,
        {
          cache: "no-store",
        }
      );

      const latestProduct = await response.json();

      console.log(
        "LATEST PRODUCT FROM BACKEND:",
        latestProduct
      );

      if (!response.ok) {
        setStockMessage("Unable to check product stock");
        return;
      }

      // Check stock
      if (
        latestProduct.stock === undefined ||
        Number(latestProduct.stock) <= 0
      ) {
        console.log("PRODUCT IS OUT OF STOCK");

        setStockMessage("Product is out of stock");
        return;
      }

      // Stock available → add to cart
      console.log("STOCK AVAILABLE - ADDING TO CART");

      setStockMessage("");
      addToCart(latestProduct);
    } catch (error) {
      console.error("Stock check error:", error);

      setStockMessage(
        "Unable to check product stock"
      );
    } finally {
      setCheckingStock(false);
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <p className="product-category">
          {product.category}
        </p>

        <h3>{product.name}</h3>

        <p className="product-price">
          ₹{product.price}
        </p>

        {stockMessage && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              margin: "10px 0",
            }}
          >
            ❌ {stockMessage}
          </p>
        )}

        <button
          className="add-cart-btn"
          onClick={handleAddToCart}
          disabled={checkingStock}
        >
          {checkingStock
            ? "Checking Stock..."
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
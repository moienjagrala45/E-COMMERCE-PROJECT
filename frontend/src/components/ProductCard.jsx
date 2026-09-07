import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [stockMessage, setStockMessage] = useState("");

  const handleAddToCart = () => {
    // Check product stock before adding to cart
    if (
      product.stock !== undefined &&
      Number(product.stock) <= 0
    ) {
      setStockMessage("Product is out of stock");
      return;
    }

    setStockMessage("");
    addToCart(product);
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
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
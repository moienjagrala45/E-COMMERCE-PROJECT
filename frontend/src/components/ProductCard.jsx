import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
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
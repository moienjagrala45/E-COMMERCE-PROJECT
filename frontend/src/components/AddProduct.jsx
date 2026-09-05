import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Get admin token
    const adminToken =
      localStorage.getItem("adminToken");

    // Token check
    if (!adminToken) {
      setMessage(
        "Admin authentication required. Please login again."
      );

      navigate("/admin");

      return;
    }

    try {
      const response = await fetch(
        "https://e-commerce-project-backend-vpdz.onrender.com/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${adminToken}`,
          },

          body: JSON.stringify({
            name,
            category,
            price: Number(price),
            image,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to add product"
        );

        return;
      }

      alert("Product added successfully!");

      navigate("/admin/products");

    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="add-product-page">

      <div className="add-product-container">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/admin/products")
          }
        >
          ← Back to Products
        </button>

        <h1>Add Product</h1>

        <p className="add-product-subtitle">
          Add a new product to your ShopEase store.
        </p>

        <form
          className="add-product-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />


          {/* CATEGORY */}

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          />


          {/* PRICE */}

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            min="1"
            required
          />


          {/* IMAGE URL */}

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            required
          />


          {/* DESCRIPTION */}

          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows="5"
            required
          />


          {/* ERROR MESSAGE */}

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="add-product-submit-btn"
          >
            Add Product
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;
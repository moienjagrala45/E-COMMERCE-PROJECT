import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

function EditProduct() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          "https://e-commerce-project-backend-pvdz.onrender.com/api/products/${id}"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to fetch product"
          );
        }

        // Existing product data form me fill
        setName(data.name || "");
        setCategory(data.category || "");
        setPrice(data.price || "");
        setImage(data.image || "");
        setDescription(
          data.description || ""
        );

      } catch (error) {
        console.error(
          "Fetch product error:",
          error
        );

        setMessage(
          error.message ||
          "Failed to load product"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  /* ================= UPDATE PRODUCT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://e-commerce-project-backend-pvdz.onrender.com/api/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
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
          data.message ||
          "Failed to update product"
        );

        return;
      }

      alert(
        "Product updated successfully!"
      );

      navigate("/admin/products");

    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    }
  };


  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="add-product-page">

        <p className="loading-text">
          Loading product...
        </p>

      </div>
    );
  }


  /* ================= PAGE ================= */

  return (
    <div className="add-product-page">

      <div className="add-product-container">

        {/* BACK BUTTON */}

        <button
          className="back-btn"
          onClick={() =>
            navigate("/admin/products")
          }
        >
          ← Back to Products
        </button>


        <h1>
          Edit Product
        </h1>


        <p className="add-product-subtitle">
          Update your product details.
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
              setDescription(
                e.target.value
              )
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


          {/* UPDATE BUTTON */}

          <button
            type="submit"
            className="add-product-submit-btn"
          >
            Update Product
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditProduct;
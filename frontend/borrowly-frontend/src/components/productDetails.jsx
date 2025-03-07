import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
import "./productDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch data if not available in state
  useEffect(() => {
    if (!product) {
      fetch(`https://borrowly-backend.onrender.com/product/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [id, product]);

  if (!product) return <h1>Loading...</h1>;

  // Function to add product to wishlist
  const addToWishlist = async () => {
    const userId = localStorage.getItem("userId");
    console.log(`The user id is :${userId}`)
    if (!userId) {
      alert("Please log in to add to wishlist");
      return;
    }

    setWishlistLoading(true);

    try {
      const response = await fetch("https://borrowly-backend.onrender.com/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: id }),
      });

      const data = await response.json();
      alert(data.message);

      let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlistItems.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));

      // Dispatch storage event to update navbar count
      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Function to add product to cart
  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add to cart");
      return;
    }

    setCartLoading(true);

    try {
      const response = await fetch("https://borrowly-backend.onrender.com/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: id }),
      });

      const data = await response.json();
      alert(data.message);

      let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      cartItems.push(product);
      localStorage.setItem('cart', JSON.stringify(cartItems));

      // Dispatch storage event to update navbar count
      window.dispatchEvent(new Event("storage"));

    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartLoading(false);
    }
  };


  // to remove from cart
  const handleRemoveFromCart = async () => {
    try {
      const response = await fetch("https://borrowly-backend.onrender.com/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      const data = await response.json();
      if (data.success) {
        setIsInCart(false);
        alert("Removed from Cart");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // to remove from wishlist
  const handleRemoveFromWishlist = async () => {
    try {
      const response = await fetch("http://localhost:5000/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      const data = await response.json();
      if (data.success) {
        setIsInWishlist(false);
        alert("Removed from Wishlist");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="product-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>X</button>

        <div className="image-section">
          <img src={product.images.img1} alt={product.prodName} className="main-image" />
          <div className="small-images">
            <img src={product.images.img2} alt={product.prodName} />
            <img src={product.images.img3} alt={product.prodName} />
          </div>
        </div>

        <div className="details-section">
          <h1>{product.prodName}</h1>

          <div className="product-info">
            <div className="info-row">
              <p><b>Category:</b> {product.category}</p>
              <p><b>Sub-Category:</b> {product.subCategory}</p>
            </div>
            <div className="info-row">
              <p><b>Type:</b> {product.type}</p>
              <p><b>Brand:</b> {product.brand}</p>
            </div>
            <div className="info-row">
              <p><b>Color:</b> {product.color}</p>
              <p><b>Material:</b> {product.material}</p>
            </div>
            <div className="info-row">
              <p><b>Gender:</b> {product.gender}</p>
              <p><b>Available Sizes:</b> {product.size}</p>
            </div>
            <div className="info-row">
              <p><b>Rental Price:</b> ₹{product.price}/per day</p>
              <p><b>Security Deposit:</b> ₹{product.deposit}</p>
            </div>
            <div className="info-row">
              <p><b>Delivery Time:</b> {product.deliveryTime} days</p>
              <p><b>Availability:</b> {product.availability}</p>
            </div>
          </div>
          <div className="description">
            <h3>Description:</h3>
            <p>{product.description}</p>
          </div>
          <div className="terms">
            <h3>Terms & Conditions:</h3>
            <p>{product.termsAndConditions}</p>
          </div>
          <div className="renter-details">
            <h3>Renter Details:</h3>
            <p><b>Name:</b> {product.renter.name}</p>
            <p><b>Phone:</b> {product.renter.phnNum}</p>
          </div>
          <div className="product-buttons">
            <button className="wishlist-btn" onClick={addToWishlist} disabled={wishlistLoading}>
              {wishlistLoading ? "Adding to Wishlist..." : "♡ Wishlist"}
            </button>
            <button className="cart-btn" onClick={addToCart} disabled={cartLoading}>
              {cartLoading ? "Adding to Cart..." : "🛒 Add to Cart"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetails;
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
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!product) {
      fetch(`https://borrowly-backend.onrender.com/product/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [id, product]);

  useEffect(() => {
    fetch(`http://localhost:7000/reviews/${id}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [id]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const submitReview = async () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("username") || "Anonymous"; // Consistent with Navbar
    
    if (!userId) {
      alert("Please log in to submit a review");
      return;
    }

    if (!userRating) {
      alert("Please select a rating");
      return;
    }

    setReviewSubmitting(true);

    try {
      const response = await fetch("http://localhost:7000/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          userId,
          rating: userRating,
          review: userReview,
          userName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReviews([...reviews, data.review]);
        setUserRating(0);
        setUserReview("");
        alert("Review submitted successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const addToWishlist = async () => {
    const userId = localStorage.getItem("userId");
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
      setIsInWishlist(true);

      let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlistItems.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

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
      setIsInCart(true);

      let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      cartItems.push(product);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to remove from cart");
      return;
    }

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
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems = cartItems.filter(item => item._id !== product._id);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event("storage"));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleRemoveFromWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to remove from wishlist");
      return;
    }

    try {
      const response = await fetch("https://borrowly-backend.onrender.com/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      const data = await response.json();
      if (data.success) {
        setIsInWishlist(false);
        alert("Removed from Wishlist");
        let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlistItems = wishlistItems.filter(item => item._id !== product._id);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        window.dispatchEvent(new Event("storage"));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (!product) return <h1>Loading...</h1>;

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

          <div className="rating-summary">
            <span>Average Rating: {getAverageRating()} ★ </span>
            <span>({reviews.length} reviews)</span>
          </div>

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
            <button 
              className="wishlist-btn" 
              onClick={isInWishlist ? handleRemoveFromWishlist : addToWishlist} 
              disabled={wishlistLoading}
            >
              {wishlistLoading 
                ? "Processing..." 
                : isInWishlist 
                ? "Remove from Wishlist" 
                : "♡ Wishlist"}
            </button>
            <button 
              className="cart-btn" 
              onClick={isInCart ? handleRemoveFromCart : addToCart} 
              disabled={cartLoading}
            >
              {cartLoading 
                ? "Processing..." 
                : isInCart 
                ? "Remove from Cart" 
                : "🛒 Add to Cart"}
            </button>
          </div>

          <div className="review-form">
            <h3>Rate & Review</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= userRating ? "star filled" : "star"}
                  onClick={() => setUserRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Write your review here..."
              rows="4"
            />
            <button
              onClick={submitReview}
              disabled={reviewSubmitting}
              className="submit-review-btn"
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review">
                  <div className="review-header">
                    <span className="review-username">{review.userName}</span>
                    <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p>{review.review}</p>
                  <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetails;
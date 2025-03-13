import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './productCard.css';

function ProductCard({ name, brand, price, image, id, product }) {
    const navigate = useNavigate();
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    // Fetch reviews for the product when the component mounts
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:7000/reviews/${id}`);
                const data = await response.json();
                setReviews(data);
                // Calculate average rating
                if (data.length > 0) {
                    const sum = data.reduce((acc, review) => acc + review.rating, 0);
                    const avg = sum / data.length;
                    setAverageRating(avg.toFixed(1)); // One decimal place
                } else {
                    setAverageRating(0);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setAverageRating(0); // Default to 0 if fetch fails
            }
        };

        fetchReviews();
    }, [id]);

    const handleClick = () => {
        navigate(`/product/${id}`, { state: { product } });
    };

    const addToCart = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User not logged in");
            return;
        }

        setCartLoading(true);

        try {
            const response = await fetch("https://borrowly-backend.onrender.com/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: id })
            });

            const data = await response.json();
            alert(data.message);

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

    const addToWishlist = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User not logged in");
            return;
        }

        setWishlistLoading(true);

        try {
            const response = await fetch("https://borrowly-backend.onrender.com/wishlist/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: id }) // Fixed to use `id`
            });

            const data = await response.json();
            alert(data.message);

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

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5; // Show half star if decimal >= 0.5

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i}>★</span>);
        }

        if (hasHalfStar) {
            stars.push(<span key="half">½</span>);
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<span key={`empty-${i}`}>☆</span>);
        }

        return stars;
    };

    return (
        <div className="product-card">
            <div className="product-image-container" onClick={handleClick} style={{ cursor: "pointer" }}>
                <img src={product.images.img1} alt={name} className="product-image" />
            </div>
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-brand">{brand}</p>
                <div className="product-rating">
                    <div className="stars">{renderStars()}</div>
                    <span className="review-count">({reviews.length})</span>
                </div>
                <div className="product-price">Rs.{price}/per day</div>
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
    );
}

export default ProductCard;
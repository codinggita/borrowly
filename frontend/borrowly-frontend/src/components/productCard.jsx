import React from 'react';
import { useState } from 'react';
import './productCard.css';
import { useNavigate } from "react-router-dom";

function ProductCard({ name, brand, price, rating, reviews, image, id, product }) {
    const navigate = useNavigate();
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);


    const handleClick = () => {
        navigate(`/product/${id}`, { state: { product } });
    };
    const addToCart = async () => {
        const userId = localStorage.getItem("userId"); // Retrieve user ID
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
            alert(data.message); // Show alert based on response

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

    const addToWishlist = async () => {
        const userId = localStorage.getItem("userId"); // Retrieve user ID
        if (!userId) {
            alert("User not logged in");
            return;
        }

        setWishlistLoading(true);

        try {
            const response = await fetch("https://borrowly-backend.onrender.com/wishlist/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: product._id })
            });

            const data = await response.json();
            alert(data.message); // Show alert based on response

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


    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

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
                    <span className="review-count">({reviews})</span>
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
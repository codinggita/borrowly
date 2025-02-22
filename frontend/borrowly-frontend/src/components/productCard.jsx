import React from 'react';
import './productCard.css';
import { useNavigate } from "react-router-dom";

function ProductCard({ name, brand, price, rating, reviews, image, id, product }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${id}`, { state: { product } });
    };
    const addToCart = async () => {
        const userId = localStorage.getItem("userId"); // Retrieve user ID
        if (!userId) {
            alert("User not logged in");
            return;
        }
    
        try {
            const response = await fetch("https://borrowly-backend.onrender.com/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: id })
            });
    
            const data = await response.json();
            alert(data.message); // Show alert based on response
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    
    const addToWishlist = async () => {
        const userId = localStorage.getItem("userId"); // Retrieve user ID
        if (!userId) {
            alert("User not logged in");
            return;
        }
    
        try {
            const response = await fetch("https://borrowly-backend.onrender.com/wishlist/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: product._id })
            });
    
            const data = await response.json();
            alert(data.message); // Show alert based on response
        } catch (error) {
            console.error("Error adding to wishlist:", error);
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

                <img src={image} alt={name} className="product-image" />
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
                    <button className="wishlist-btn" onClick={addToWishlist}>
                        ♡ Wishlist
                    </button>
                    <button className="cart-btn" onClick={addToCart}>
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
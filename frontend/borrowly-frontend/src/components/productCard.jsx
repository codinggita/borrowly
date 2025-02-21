import React from 'react';
import './productCard.css';
import { useNavigate } from "react-router-dom";

function ProductCard({ name, brand, price, rating, reviews, image, id, product }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${id}`, { state: { product } });
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
        <div className="product-card" onClick={handleClick} style={{ cursor: "pointer" }}>
            <div className="product-image-container">

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
                    <button className="wishlist-btn">
                        ♡ Wishlist
                    </button>
                    <button className="cart-btn">
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
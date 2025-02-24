import React, { useState, useEffect } from "react";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
import "./cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = async (index) => {
    const selectedItem = cartItems[index];

    try {
      await fetch("https://localhost:3000/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      const updatedCart = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const moveToWishlist = async (index) => {
    const selectedItem = cartItems[index];

    try {
      // Remove from cart in backend
      await fetch("https://localhost:3000/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      // Add to wishlist in backend
      await fetch("http://localhost:3000/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });
      

      // Update frontend state
      const updatedCart = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlistItems.push(selectedItem);
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error moving to wishlist:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="cart-container">
        <h1>Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img 
                  src={item.images?.img1 || "fallback-image-url.jpg"} 
                  alt={item.prodName || "Product Image"} 
                  className="cart-image" 
                />
                <div className="cart-details">
                  <h3>{item.prodName}</h3>
                  <p><b>Rental Price:</b> ₹{item.price} per day</p>
                  <p><b>Security Deposit:</b> ₹{item.deposit}</p>
                  <button onClick={() => moveToWishlist(index)}>Move to Wishlist</button>
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;


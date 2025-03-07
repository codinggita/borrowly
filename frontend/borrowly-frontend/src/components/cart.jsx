import React, { useState, useEffect } from "react";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
import "./cart.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = async (index) => {
    const selectedItem = cartItems[index];
    setLoadingStates((prev) => ({ ...prev, [selectedItem._id]: "Removing..." }));

    try {
      await fetch("https://borrowly-backend.onrender.com/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      const updatedCart = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoadingStates((prev) => {
        const updatedStates = { ...prev };
        delete updatedStates[selectedItem._id];
        return updatedStates;
      });
    }
  };

  const moveToWishlist = async (index) => {
    const selectedItem = cartItems[index];
    setLoadingStates((prev) => ({ ...prev, [selectedItem._id]: "Moving to Wishlist..." }));

    try {
      // Remove from cart in backend
      await fetch("https://borrowly-backend.onrender.com/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      // Add to wishlist in backend
      await fetch("https://borrowly-backend.onrender.com/wishlist/add", {
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
    finally {
      setLoadingStates((prev) => {
        const updatedStates = { ...prev };
        delete updatedStates[selectedItem._id];
        return updatedStates;
      });
    }
  };

  const handleImageClick = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleCheckout = () => {
    navigate(`/checkout`, { state: { cartItems } });
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
                  src={item.images?.img1}
                  alt={item.prodName || "Product Image"}
                  className="cart-image" onClick={() => handleImageClick(item)} style={{ cursor: "pointer" }} />
                <div className="cart-details">
                  <h3>{item.prodName}</h3>
                  <p><b>Rental Price:</b> ₹{item.price} per day</p>
                  <p><b>Security Deposit:</b> ₹{item.deposit}</p>
                  <button onClick={() => moveToWishlist(index)} disabled={loadingStates[item._id]}>
                    {loadingStates[item._id] === "Moving to Wishlist..." ? "Moving to Wishlist..." : "Move to Wishlist"}
                  </button>

                  <button onClick={() => removeFromCart(index)} disabled={loadingStates[item._id]}>
                    {loadingStates[item._id] === "Removing..." ? "Removing..." : "Remove"}
                  </button>

                  {cartItems.length > 0 && (
                    <button className="checkout-button" onClick={handleCheckout}>
                      Checkout
                    </button>
                  )}
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


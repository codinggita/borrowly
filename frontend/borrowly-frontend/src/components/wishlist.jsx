import React, { useState, useEffect } from "react";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
import "./wishlist.css";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("userId");
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Load wishlist items from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);


  const removeFromWishlist = async (index) => {
    const selectedItem = wishlist[index];
    setLoadingStates((prev) => ({ ...prev, [selectedItem._id]: "Removing..." }));

    try {
      await fetch("https://borrowly-backend.onrender.com/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      const updatedWishlist = wishlist.filter((_, i) => i !== index);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoadingStates((prev) => {
        const updatedStates = { ...prev };
        delete updatedStates[selectedItem._id];
        return updatedStates;
      });
    }
  };

  const moveToCart = async (index) => {
    const selectedItem = wishlist[index];
    setLoadingStates((prev) => ({ ...prev, [selectedItem._id]: "Moving to Cart..." }));

    try {
      // Remove from wishlist in backend
      await fetch("https://borrowly-backend.onrender.com/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      // Add to cart in backend
      await fetch("https://borrowly-backend.onrender.com/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      // Update frontend state
      const updatedWishlist = wishlist.filter((_, i) => i !== index);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems.push(selectedItem);
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
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

  return (
    <div>
      <Navbar />
      <div className="wishlist-container">
        <h1>Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="wishlist-items">
            {wishlist.map((item, index) => (
              <div key={index} className="wishlist-item">
                <img 
                  src={item.images?.img1} 
                  alt={item.prodName || "Product Image"} 
                  className="wishlist-image" onClick={() => handleImageClick(item)} style={{cursor: "pointer"}}/>
                <div className="wishlist-details">
                  <h3>{item.prodName}</h3>
                  <p><b>Rental Price:</b> ₹{item.price} per day</p>
                  <p><b>Security Deposit:</b> ₹{item.deposit}</p>
                  <button 
                    onClick={() => moveToCart(index)} 
                    disabled={loadingStates[item._id]}>
                    {loadingStates[item._id] === "Moving to Cart..." ? "Moving to Cart..." : "Move to Cart"}
                  </button>
                  
                  <button 
                    onClick={() => removeFromWishlist(index)} 
                    disabled={loadingStates[item._id]}>
                    {loadingStates[item._id] === "Removing..." ? "Removing..." : "Remove"}
                  </button>
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

export default Wishlist;
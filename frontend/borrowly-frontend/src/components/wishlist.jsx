import React, { useState, useEffect } from "react";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
import "./wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Load wishlist items from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);


  const removeFromWishlist = async (index) => {
    const selectedItem = wishlist[index];

    try {
      await fetch("http://localhost:3000/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      const updatedWishlist = wishlist.filter((_, i) => i !== index);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const addToWishlist = async () => {
    const userId = localStorage.getItem("userId"); // Retrieve _id from localStorage
    if (!userId) {
        alert("User not logged in");
        return;
    }

    setWishlistLoading(true);

    try {
        const response = await fetch("http://localhost:3000/wishlist/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId: id }) // Make sure 'id' is correct
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


  const moveToCart = async (index) => {
    const selectedItem = wishlist[index];

    try {
      // Remove from wishlist in backend
      await fetch("http://localhost:3000/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: selectedItem._id }),
      });

      // Add to cart in backend
      await fetch("http://localhost:3000/cart/add", {
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
    }
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
                  src={item.images?.img1 || "fallback-image-url.jpg"} 
                  alt={item.prodName || "Product Image"} 
                  className="wishlist-image" 
                />
                <div className="wishlist-details">
                  <h3>{item.prodName}</h3>
                  <p><b>Rental Price:</b> ₹{item.price} per day</p>
                  <p><b>Security Deposit:</b> ₹{item.deposit}</p>
                  <button onClick={() => moveToCart(index)}>Move to Cart</button>
                  <button onClick={() => removeFromWishlist(index)}>Remove</button>
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
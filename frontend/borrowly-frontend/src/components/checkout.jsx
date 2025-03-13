import  { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.product ? [location.state.product] : JSON.parse(localStorage.getItem('cart')) || []);
  const [selectedDurations, setSelectedDurations] = useState({});
  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactNumber: '',
    preferredDeliveryDate: '',
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      alert('Please log in to proceed with checkout.');
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleDurationChange = (productId, duration) => {
    setSelectedDurations(prev => ({ ...prev, [productId]: duration }));
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const duration = selectedDurations[item._id] || item.duration[0]; // Default to first duration
      return total + (parseInt(item.price) * parseInt(duration)) + parseInt(item.deposit);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return alert('Cart is empty.');
    if (Object.keys(selectedDurations).length !== cartItems.length) return alert('Please select duration for all items.');
    const { fullName, address, city, state, zipCode, contactNumber, preferredDeliveryDate } = deliveryInfo;
    if (!fullName || !address || !city || !state || !zipCode || !contactNumber || !preferredDeliveryDate) {
      return alert('Please fill in all delivery details.');
    }

    setLoading(true);
    const orderData = {
      userId,
      items: cartItems.map(item => ({
        productId: item._id,
        duration: selectedDurations[item._id],
        price: item.price,
        deposit: item.deposit,
      })),
      total: calculateTotal(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      deliveryInfo: {
        fullName,
        address,
        city,
        state,
        zipCode,
        contactNumber,
        preferredDeliveryDate,
      },
    };

    try {
      const response = await fetch('https://borrowly-backend.onrender.com/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        localStorage.setItem('cart', JSON.stringify([])); // Clear cart
        window.dispatchEvent(new Event('storage'));
        navigate('/landingPage');
      } else {
        const error = await response.json();
        alert(`Checkout failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="checkout-container">
        <button onClick={() => navigate(-1)}>X</button>
        <h1>Checkout</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item._id} className="checkout-item">
                <img src={item.images?.img1} alt={item.prodName} className="checkout-image" />
                <div className="checkout-details">
                  <h3>{item.prodName}</h3>
                  <p><b>Price:</b> ₹{item.price}/day</p>
                  <p><b>Deposit:</b> ₹{item.deposit}</p>
                  <div className="duration-options">
                    <h4>Select Duration:</h4>
                    {item.duration.map(d => (
                      <label key={d}>
                        <input
                          type="radio"
                          name={`duration-${item._id}`}
                          value={d}
                          checked={selectedDurations[item._id] === d}
                          onChange={() => handleDurationChange(item._id, d)}
                        />
                        {d} Days
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="delivery-form">
              <h3>Delivery Information</h3>
              <input
                type="text"
                name="fullName"
                value={deliveryInfo.fullName}
                onChange={handleDeliveryChange}
                placeholder="Full Name"
                required
              />
              <input
                type="text"
                name="address"
                value={deliveryInfo.address}
                onChange={handleDeliveryChange}
                placeholder="Street Address"
                required
              />
              <input
                type="text"
                name="city"
                value={deliveryInfo.city}
                onChange={handleDeliveryChange}
                placeholder="City"
                required
              />
              <input
                type="text"
                name="state"
                value={deliveryInfo.state}
                onChange={handleDeliveryChange}
                placeholder="State"
                required
              />
              <input
                type="text"
                name="zipCode"
                value={deliveryInfo.zipCode}
                onChange={handleDeliveryChange}
                placeholder="ZIP Code"
                required
              />
              <input
                type="tel"
                name="contactNumber"
                value={deliveryInfo.contactNumber}
                onChange={handleDeliveryChange}
                placeholder="Contact Number"
                required
              />
              <input
                type="date"
                name="preferredDeliveryDate"
                value={deliveryInfo.preferredDeliveryDate}
                onChange={handleDeliveryChange}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                required
              />
            </div>
            <div className="checkout-summary">
              <h3>Total: ₹{calculateTotal()}</h3>
              <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import './user.css';

const UserProfile = () => {
  const [rentedItems, setRentedItems] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [rentFilter, setRentFilter] = useState('all');
  const [borrowFilter, setBorrowFilter] = useState('all');

  const fetchTransactions = async (type, timeframe) => {
    try {
      const response = await fetch(`http://localhost:3000/api/transactions?type=${type}&timeframe=${timeframe}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  const fetchRentals = async () => {
    const rentals = await fetchTransactions('rent', rentFilter);
    setRentedItems(rentals);
  };

  const fetchBorrows = async () => {
    const borrows = await fetchTransactions('borrow', borrowFilter);
    setBorrowedItems(borrows);
  };

  useEffect(() => {
    fetchRentals();
    fetchBorrows();
  }, [rentFilter, borrowFilter]);

  return (
    <div className="container">
      <h1>User Profile</h1>

      <div className="section">
        <h2>Rented Items</h2>
        <select
          value={rentFilter}
          onChange={(e) => setRentFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="6days">Last 6 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
        </select>
        <div className="items-container">
          {rentedItems.map((item) => (
            <div key={item.id} className="item">
              <p>Product: {item.productName}</p>
              <p>Date: {item.date}</p>
              <p>
                Status: <span className={`status-${item.status}`}>{item.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Borrowed Items</h2>
        <select
          value={borrowFilter}
          onChange={(e) => setBorrowFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="6days">Last 6 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
        </select>
        <div className="items-container">
          {borrowedItems.map((item) => (
            <div key={item.id} className="item">
              <p>Product: {item.productName}</p>
              <p>Date: {item.date}</p>
              <p>
                Status: <span className={`status-${item.status}`}>{item.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
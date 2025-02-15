import React, { useState, useEffect } from 'react';
import Navbar from './navbar.jsx';
import './rent.css';

const Rent = () => {
  const [formData, setFormData] = useState({
    prodName: '',
    category: '',
    subCategory: '',
    type: '',
    gender: '',
    size: '',
    material: '',
    color: '',
    brand: '',
    price: '',
    duration: '',
    deposit: '',
    description: '',
    termsAndConditions: '',
    deliveryTime: '',
    availability: '',
    images: { img1: '', img2: '', img3: '' },
    renter: {
      name: '',
      phnNum: '',
      email: '',
      address: '',
      city: '',
      pincode: '',
    },
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the input field belongs to the renter object
    if (name.startsWith("renter.")) {
      const field = name.split(".")[1]; // Extract field name after "renter."
      setFormData((prevData) => ({
        ...prevData,
        renter: {
          ...prevData.renter,
          [field]: value,
        },
      }));
    } else {
      // For other fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleImageUpload = async (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      const uploadPreset = 'YOUR_UPLOAD_PRESET'; // Set up an upload preset on Cloudinary dashboard
      const cloudName = 'dppoujdl9';
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          setFormData((prevData) => ({
            ...prevData,
            images: {
              ...prevData.images,
              [imageKey]: data.secure_url,
            },
          }));
        } else {
          alert('Error uploading image');
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://borrowly.onrender.com/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Form submitted successfully");
        setFormData({
          prodName: "",
          category: "",
          subCategory: "",
          type: "",
          gender: "",
          size: "",
          material: "",
          color: "",
          brand: "",
          price: "",
          duration: "",
          deposit: "",
          description: "",
          termsAndConditions: "",
          deliveryTime: "",
          availability: "",
          images: { img1: "", img2: "", img3: "" },
          renter: {
            name: "",
            phnNum: "",
            email: "",
            address: "",
            city: "",
            pincode: "",
          },
        }); // Reset form after successful submission
        console.log("hello",formData)
        
        setShowForm(false); // Close the form popup
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div>

        <Navbar/>

      {/* Button to trigger the popup */}
      <button
        className="rent-button"
        onClick={() => setShowForm(true)}
      >
        CLICK HERE TO RENT
      </button>

      {/* Modal for the form */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setShowForm(false)}
            >
              &times;
            </span>

            <form onSubmit={handleSubmit}>
              <h2>Rent Product Form</h2>

              <input
                type="file"
                name="images.img1"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'img1')}
              />
              <input
                type="file"
                name="images.img2"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'img2')}
              />
              <input
                type="file"
                name="images.img3"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'img3')}
              />

              <input
                type="text"
                name="prodName"
                placeholder="Product Name"
                value={formData.prodName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
              />
              <input
                type="text"
                name="subCategory"
                placeholder="Sub-Category"
                value={formData.subCategory}
                onChange={handleChange}
              />
              <input
                type="text"
                name="type"
                placeholder="Type (optional)"
                value={formData.type}
                onChange={handleChange}
              />

              {/* Gender Buttons */}
              <div>
                <label>
                  Gender:
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                  />
                  Male
                </label>
              </div>

              {/* Size Buttons */}
              <div>
                <label>
                  Size:
                  {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                    <label key={size}>
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={formData.size === size}
                        onChange={handleChange}
                      />
                      {size}
                    </label>
                  ))}
                </label>
              </div>

              <input
                type="text"
                name="material"
                placeholder="Material"
                value={formData.material}
                onChange={handleChange}
              />
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
              />

              <div>
                <label>
                  Duration:
                  <input
                    type="radio"
                    name="duration"
                    value="3 days"
                    checked={formData.duration === '3 days'}
                    onChange={handleChange}
                  />
                  3 days
                </label>
                <label>
                  <input
                    type="radio"
                    name="duration"
                    value="5 days"
                    checked={formData.duration === '5 days'}
                    onChange={handleChange}
                  />
                  5 days
                  <input
                    type="radio"
                    name="duration"
                    value="7 days"
                    checked={formData.duration === '7 days'}
                    onChange={handleChange}
                  />
                  7 days
                </label>
              </div>

              <input
                type="text"
                name="deposit"
                placeholder="Deposit"
                value={formData.deposit}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />
              <textarea
                name="termsAndConditions"
                placeholder="Terms and Conditions"
                value={formData.termsAndConditions}
                onChange={handleChange}
              />
              <input
                type="text"
                name="deliveryTime"
                placeholder="Delivery Time"
                value={formData.deliveryTime}
                onChange={handleChange}
              />
              <input
                type="text"
                name="availability"
                placeholder="Availability"
                value={formData.availability}
                onChange={handleChange}
              />

              

              {/* Renter Details */}
              <input
                type="text"
                name="renter.name"
                placeholder="Renter Name"
                value={formData.renter.name}
                onChange={handleChange}
              />
              <input
                type="number"
                name="renter.phnNum"
                placeholder="Phone Number"
                value={formData.renter.phnNum}
                onChange={handleChange}
              />
              <input
                type="email"
                name="renter.email"
                placeholder="Email"
                value={formData.renter.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="renter.address"
                placeholder="Address"
                value={formData.renter.address}
                onChange={handleChange}
              />
              <input
                type="text"
                name="renter.city"
                placeholder="City"
                value={formData.renter.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="renter.pincode"
                placeholder="Pincode"
                value={formData.renter.pincode}
                onChange={handleChange}
              />
              
              
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rent;

import React, { useState } from 'react';
import './form.css';

const Form = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                size: checked ? [...prevData.size, value] : prevData.size.filter((s) => s !== value),
            }));
        } else if (name.startsWith("renter.")) {
            const field = name.split(".")[1];
            setFormData((prevData) => ({
                ...prevData,
                renter: { ...prevData.renter, [field]: value },
            }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleImageUpload = async (e, imageKey) => {
        const file = e.target.files[0];
        if (file) {
            const uploadPreset = 'YOUR_UPLOAD_PRESET';
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
                    prodName: '', category: '', subCategory: '', type: '', gender: '', size: '',
                    material: '', color: '', brand: '', price: '', duration: '', deposit: '',
                    description: '', termsAndConditions: '', deliveryTime: '', availability: '',
                    images: { img1: '', img2: '', img3: '' },
                    renter: { name: '', phnNum: '', email: '', address: '', city: '', pincode: '' },
                });
                onClose();
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error submitting form. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Rent Your Product</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>

                <p className="form-subtitle">Fill in the details below to list your product for rent</p>

                <form onSubmit={handleSubmit}>
                    <div className="image-upload-section">
                        <h3>Product Images</h3>
                        <div className="image-upload-grid">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="upload-box">
                                    <input type="file" onChange={(e) => handleImageUpload(e, `img${index + 1}`)} required />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input type="text" name="prodName" value={formData.prodName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                <option value="Clothed">Clothes</option>
                                <option value="Footwears">Footwears</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div className="form-group">
                                <label>Sub-Category</label>
                                <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <input type="text" name="type" value={formData.type} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="gender-section">
                        <label>Gender</label>
                        <div className="radio-group">
                            <label>
                                <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
                                Female
                            </label>
                            <label>
                                <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
                                Male
                            </label>
                        </div>
                    </div>

                    <div className="size-section">
                        <label>Size</label>
                        <div className="checkbox-group">
                            {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                                <label key={size}>
                                    <input type="checkbox" name="size" value={size} checked={formData.size.includes(size)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                size: [...prevData.size, size], // Add selected size
                                            }));
                                        } else {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                size: prevData.size.filter((s) => s !== size), // Remove deselected size
                                            }));
                                        }
                                    }} required />
                                    {size}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Color</label>
                            <input type="text" name='color' value={formData.color} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Brand</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Price per Day (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="rental-options">
                        <h3>Rental Duration Options</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                {["Days option 1", "Days option 2", "Days option 3"].map((label, index) => (
                                    <div className="form-group" key={index}>
                                        <label>{label}</label>
                                        <input type="number" name="duration" value={formData.duration[index] || ""}
                                            onChange={(e) => {
                                                const newDurations = [...formData.duration];
                                                newDurations[index] = e.target.value;
                                                setFormData({ ...formData, duration: newDurations });
                                            }} required={index < 2} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Deposit Amount (₹)</label>
                        <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Product Description</label>
                        <textarea rows="4" name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Terms and Conditions</label>
                        <textarea rows="4" name="termsAndConditions" value={formData.termsAndConditions} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Delivery Time (days)</label>
                            <input type="number" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Availability</label>
                            <select defaultValue="Availability" name="availability" value={formData.availability} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="Available">Available</option>
                                <option value="Rented">Rented</option>
                            </select>
                        </div>
                    </div>

                    <div className="renter-information">
                        <h3>Renter Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="renter.name" value={formData.renter.name} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="renter.phnNum" value={formData.renter.phnNum} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="renter.email" value={formData.renter.email} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" name="renter.address" value={formData.renter.address} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="renter.city" value={formData.renter.city} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Pincode</label>
                                <input type="text" name="renter.pincode" value={formData.renter.pincode} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="submit-button">Submit Form</button>
                    </div>
                </form>

                <div className="modal-footer">
                    <p>Borrowly Rental Platform. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Form;

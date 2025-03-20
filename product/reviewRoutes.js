// backend/product/reviewRoutes.js
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const reviewRoutes = express.Router();

// Enable CORS
reviewRoutes.use(cors());

// MongoDB connection details (matching your index.js)
const uri = 'mongodb+srv://test:test123@cluster0.cmvmn.mongodb.net/';
const dbName = 'products';

// Get all reviews for a product
reviewRoutes.get('/reviews/:productId', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const reviewsCollection = db.collection('reviews');

        const reviews = await reviewsCollection
            .find({ productId: req.params.productId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .toArray();

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching reviews' 
        });
    } finally {
        if (client) client.close();
    }
});

// Add a new review
reviewRoutes.post('/reviews/add', async (req, res) => {
    let client;
    try {
        const { productId, userId, rating, review, userName } = req.body;

        // Validation
        if (!productId || !userId || !rating || !userName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const reviewsCollection = db.collection('reviews');

        // Check if user has already reviewed this product
        const existingReview = await reviewsCollection.findOne({ 
            productId, 
            userId 
        });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const newReview = {
            productId,
            userId,
            rating: Number(rating),
            review,
            userName,
            createdAt: new Date()
        };

        const result = await reviewsCollection.insertOne(newReview);

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review: { _id: result.insertedId, ...newReview }
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding review'
        });
    } finally {
        if (client) client.close();
    }
});

// Delete a review
reviewRoutes.delete('/reviews/remove', async (req, res) => {
    let client;
    try {
        const { userId, reviewId } = req.body;

        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const reviewsCollection = db.collection('reviews');

        const review = await reviewsCollection.findOne({ 
            _id: new ObjectId(reviewId), 
            userId 
        });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or not authorized'
            });
        }

        await reviewsCollection.deleteOne({ _id: new ObjectId(reviewId) });
        res.json({
            success: true,
            message: 'Review removed successfully'
        });
    } catch (error) {
        console.error('Error removing review:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing review'
        });
    } finally {
        if (client) client.close();
    }
});

// Update a review
reviewRoutes.put('/reviews/update', async (req, res) => {
    let client;
    try {
        const { userId, reviewId, rating, review: reviewText } = req.body;

        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const reviewsCollection = db.collection('reviews');

        const existingReview = await reviewsCollection.findOne({ 
            _id: new ObjectId(reviewId), 
            userId 
        });
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or not authorized'
            });
        }

        const updatedReview = {
            ...existingReview,
            rating: Number(rating),
            review: reviewText,
            updatedAt: new Date()
        };

        await reviewsCollection.updateOne(
            { _id: new ObjectId(reviewId) },
            { $set: { rating: Number(rating), review: reviewText, updatedAt: new Date() } }
        );

        res.json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review'
        });
    } finally {
        if (client) client.close();
    }
});

export default reviewRoutes;
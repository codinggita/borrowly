import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const wishlistRoutes = express.Router();
wishlistRoutes.use(cors());

const uri = "mongodb+srv://isha:ishapatel@cluster0.2dsxv.mongodb.net/";
const dbName = "products";

wishlistRoutes.post("/add", async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const usersCollection = db.collection("signup"); // Users collection
        const productsCollection = db.collection("mixture"); // Product collection

        // Check if user exists
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            client.close();
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch product details
        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
        if (!product) {
            client.close();
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product already exists in wishlist
        const existingWishlist = user.wishlist || [];
        const alreadyInWishlist = existingWishlist.some(item => item._id.toString() === productId);

        if (!alreadyInWishlist) {
            await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { wishlist: product } } // Store full product details
            );
        }

        res.json({ success: true, message: "Added to Wishlist", product });
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

wishlistRoutes.delete("/remove", async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const usersCollection = db.collection("signup");

        // Check if user exists
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            client.close();
            return res.status(404).json({ message: "User not found" });
        }

        // Remove product from wishlist
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { wishlist: { _id: new ObjectId(productId) } } } // Remove productId from wishlist array
        );

        res.json({ success: true, message: "Removed from Wishlist" });
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


export default wishlistRoutes;

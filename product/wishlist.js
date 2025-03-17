import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const wishlistRoutes = express.Router();
wishlistRoutes.use(cors());

const uri = process.env.mongo_uri;
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

        // Check if user exists
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            client.close();
            return res.status(404).json({ message: "User not found" });
        }

        // Check if product already exists in wishlist
        if (!user.wishlist.includes(productId)) {
            await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { wishlist: productId } }
            );
        }

        res.json({ success: true, message: "Added to Wishlist" });
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
            { $pull: { wishlist: productId } } // Remove productId from wishlist array
        );

        res.json({ success: true, message: "Removed from Wishlist" });
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


export default wishlistRoutes;

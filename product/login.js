import express from 'express';
import cors from "cors";
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const loginRoutes = express.Router();
loginRoutes.use(cors());

const uri = process.env.MONGO_URI;
const dbName = 'products';

// POST: Login user
loginRoutes.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required" });
    }

    // Regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(username) && !phoneRegex.test(username)) {
        return res.status(400).json({ message: 'Enter a valid email or phone number' });
    }

    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const usersCollection = db.collection('signup');

        // Find user by username
        const user = await usersCollection.findOne({ username });

        if (!user) {
            client.close();
            return res.status(401).json({ message: "User not found. Please register first." });
        }

        // Check if password matches
        if (user.password !== password) {
            client.close();
            return res.status(401).json({ message: "Invalid password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: { userId: user._id, username: user.username, cart: user.cart, wishlist: user.wishlist }
        });

        client.close();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to log in" });
    }
});

export default loginRoutes;
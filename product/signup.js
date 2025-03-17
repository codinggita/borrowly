import express from 'express';
import cors from "cors";
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const usersRoutes = express.Router();
usersRoutes.use(cors());

const uri = process.env.MONGO_URI;  // Local MongoDB URI
const dbName = 'products';

usersRoutes.post('/register', async (req, res) => {
    const { username, emailOrPhone, password, wishlist, cart } = req.body;

    if (!username || !emailOrPhone || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Valid email format
    const phoneRegex = /^[6-9]\d{9}$/;  // Valid Indian 10-digit phone number (starting with 6-9)

    if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
        return res.status(400).json({ message: 'Enter a valid email or phone number' });
    }

    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const usersCollection = db.collection('signup');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ $or: [{ emailOrPhone }] });
        if (existingUser) {
            client.close();
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = {
            username,
            emailOrPhone,
            password,
            wishlist:[],
            cart:[]
        };

        const result = await usersCollection.insertOne(newUser);

        res.status(201).json({ success: true, message: 'User registered successfully!', userId: result.insertedId });

        client.close();
    } catch (err) {
        res.status(500).json({ message: 'Failed to register user' });
    }
});

export default usersRoutes;
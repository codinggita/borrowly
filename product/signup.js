import express from 'express';
import cors from "cors";
import { MongoClient } from 'mongodb';

const usersRoutes = express.Router();
usersRoutes.use(cors());

const uri = 'mongodb+srv://isha:ishapatel@cluster0.2dsxv.mongodb.net/';  // Local MongoDB URI
const dbName = 'products';

usersRoutes.post('/register', async (req, res) => {
    const { username, emailOrPhone, password } = req.body;

    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const usersCollection = db.collection('signup');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ $or: [{ emailOrPhone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Insert the new user
        await usersCollection.insertOne({ username, emailOrPhone, password });
        res.status(201).json({ message: 'User registered successfully!' });
        client.close();
    } catch (err) {
        res.status(500).json({ message: 'Failed to register user' });
    }
});

export default usersRoutes;

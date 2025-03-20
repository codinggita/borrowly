import express from "express";
import cors from "cors";  // Import CORS middleware
import { MongoClient } from "mongodb";
import 'dotenv/config';

const clothesRoutes = express.Router();

// Enable CORS for this router
clothesRoutes.use(cors());

const uri = process.env.MONGO_URI;  // Local MongoDB URI
const dbName = 'products';  // Database name

// Route to fetch all clothes
clothesRoutes.get('/', async (req, res) => {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const clothesCollection = db.collection('clothes');  // Access the clothes collection

        const clothes = await clothesCollection.find().toArray(); // Fetch all clothes
        res.status(200).json(clothes);  // Send the clothes as JSON response
        
        client.close(); // Close the connection
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch clothes' });
    }
});

export default clothesRoutes;

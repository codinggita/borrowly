import express from "express";
import cors from "cors";  // Import CORS middleware
import { MongoClient } from "mongodb";

const accessoriesRoutes = express.Router();

// Enable CORS for this router
accessoriesRoutes.use(cors());

const uri = process.env.mongo_uri;  // Local MongoDB URI
const dbName = 'products';  // Database name

// Create a route to fetch all accessories
accessoriesRoutes.get('/', async (req, res) => {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const accessoriesCollection = db.collection('accessories');  // Access the accessories collection

        const accessories = await accessoriesCollection.find().toArray(); // Fetch all accessories
        res.status(200).json(accessories);  // Send the accessories as JSON response
        
        client.close(); // Close the connection
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch accessories' });
    }
});

export default accessoriesRoutes;

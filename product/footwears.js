import express from "express";
import cors from "cors";  // Import CORS middleware
import { MongoClient } from "mongodb";

const footwearsRoutes = express.Router();

// Enable CORS for this router
footwearsRoutes.use(cors());

const uri = process.env.mongo_uri;  // Local MongoDB URI
const dbName = 'products';  // Database name

// Route to fetch all footwears
footwearsRoutes.get('/', async (req, res) => {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const footwearsCollection = db.collection('footwears');  // Access the footwears collection

        const footwears = await footwearsCollection.find().toArray(); // Fetch all footwears
        res.status(200).json(footwears);  // Send the footwears as JSON response
        
        client.close(); // Close the connection
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch footwears' });
    }
});

export default footwearsRoutes;

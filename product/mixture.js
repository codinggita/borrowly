import express from "express";
import cors from "cors";  // Import CORS middleware
import { MongoClient } from "mongodb";

const mixtureRoutes = express.Router();

// Enable CORS
mixtureRoutes.use(cors());

const uri = process.env.mongo_uri;  // Local MongoDB URI
const dbName = 'products';  // Database name

// Create a route to fetch all accessories
mixtureRoutes.get('/', async (req, res) => {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const mixtureCollection = db.collection('mixture');

        const mixture = await mixtureCollection.find().toArray(); 
        res.status(200).json(mixture);
        
        client.close(); // Close the connection
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch the data' });
    }
});

mixtureRoutes.post('/', async (req, res) => {
    try {
        const { name, price, description } = req.body;

        if (!name || !price || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const mixtureCollection = db.collection('mixture');

        const newMixture = { name, price, description };
        const result = await mixtureCollection.insertOne(newMixture);

        res.status(201).json({ message: 'Item added successfully', data: result.ops });
        
        client.close();
    } catch (err) {
        res.status(500).json({ error: 'Failed to add the item' });
    }
});

export default mixtureRoutes;

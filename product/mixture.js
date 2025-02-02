import express from "express";
import { MongoClient } from "mongodb";
const mixtureRoutes = express.Router();

const uri = 'mongodb+srv://isha:ishapatel@cluster0.2dsxv.mongodb.net/';  // Local MongoDB URI
const dbName = 'products';  // Database name


// Create a route to fetch all accessories
mixtureRoutes.get('/', async (req, res) => {
    try {

        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const mixtureCollection = db.collection('mixture');  // Access the accessories collection


        const mixture = await mixtureCollection.find().toArray(); // Fetch all accessories
        res.status(200).json(mixture);  // Send the accessories as JSON response
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch the data' });
    }
});


mixtureRoutes.post('/', async (req, res) => {
    try {
        const { name, price, description } = req.body;  // Extract data from request body

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
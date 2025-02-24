import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const productsRoutes = express.Router();
productsRoutes.use(cors());

const uri = "mongodb+srv://isha:ishapatel@cluster0.2dsxv.mongodb.net/";
const dbName = "products";

// Route to get full product details by IDs
productsRoutes.post("/", async (req, res) => {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: "Invalid product IDs" });
    }

    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const productsCollection = db.collection("products"); // Your products collection

        // Fetch full product details using the IDs
        const products = await productsCollection.find({
            _id: { $in: productIds.map(id => new ObjectId(id)) }
        }).toArray();

        res.json(products);
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default productsRoutes;

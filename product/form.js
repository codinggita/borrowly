import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import 'dotenv/config';

const formRoutes = express.Router();
formRoutes.use(cors());

const uri = process.env.MONGO_URI;
const dbName = "products";

// 🔹 POST route to add a product to the database
formRoutes.post("/submit-form", async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    
    const { category } = req.body;  // Extract category from request body
    const productData = req.body;   // Store entire product data

    // 🔹 Insert into the "mixture" collection (stores all products)
    const mixtureCollection = db.collection("mixture");
    await mixtureCollection.insertOne(productData);

    // 🔹 Insert into specific collection based on category
    if (category === "Clothes" || category === "clothes") {
      const clothesCollection = db.collection("clothes");
      await clothesCollection.insertOne(productData);
    } else if (category === "Footwear" || category === "footwear" || category === "Footwears" || category === "footwears") {
      const footwearsCollection = db.collection("footwears");
      await footwearsCollection.insertOne(productData);
    } else if (category === "Accessories" || category === "Accessorie" || category === "accessories" || category === "accessorie") {
      const accessoriesCollection = db.collection("accessories");
      await accessoriesCollection.insertOne(productData);
    } else {
      console.log("⚠️ Invalid category:", category);
    }

    res.status(201).json({ message: "Product added successfully!" });

    client.close();  // Close MongoDB connection
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Failed to add the product", details: err.message });
  }
});

export default formRoutes;

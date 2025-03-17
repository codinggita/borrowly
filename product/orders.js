import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const ordersRoutes = express.Router();
ordersRoutes.use(cors());

const uri = process.env.mongo_uri;
const dbName = 'products';

ordersRoutes.post('/', async (req, res) => {
  const { userId, items, total, status, createdAt } = req.body;

  if (!userId || !items || !total) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    const mixtureCollection = db.collection('mixture');

    // Create order
    const order = { userId: new ObjectId(userId), items, total, status, createdAt };
    const result = await ordersCollection.insertOne(order);

    // Update product availability
    for (const item of items) {
      await mixtureCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        { $set: { availability: 'Rented' } }
      );
    }

    res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    client.close();
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error });
  }
});

export default ordersRoutes;
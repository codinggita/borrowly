import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import 'dotenv/config';

const ordersRoutes = express.Router();
ordersRoutes.use(cors());

const uri = process.env.MONGO_URI;
const dbName = 'products';

// POST /orders - Create a new order with delivery information
ordersRoutes.post('/', async (req, res) => {
  const { userId, items, total, status, createdAt, deliveryInfo } = req.body;

  // Validation for required fields
  if (!userId || !items || !total || !status || !createdAt) {
    return res.status(400).json({ message: "Missing required order fields" });
  }

  if (!deliveryInfo || 
      !deliveryInfo.fullName || 
      !deliveryInfo.address || 
      !deliveryInfo.city || 
      !deliveryInfo.state || 
      !deliveryInfo.zipCode || 
      !deliveryInfo.contactNumber || 
      !deliveryInfo.preferredDeliveryDate) {
    return res.status(400).json({ message: "Missing required delivery information" });
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    const mixtureCollection = db.collection('mixture');

    // Create order with delivery info
    const order = { 
      userId: new ObjectId(userId), 
      items, 
      total, 
      status, 
      createdAt,
      deliveryInfo: {
        fullName: deliveryInfo.fullName,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        state: deliveryInfo.state,
        zipCode: deliveryInfo.zipCode,
        contactNumber: deliveryInfo.contactNumber,
        preferredDeliveryDate: deliveryInfo.preferredDeliveryDate,
      }
    };
    const result = await ordersCollection.insertOne(order);

    // Update product availability
    for (const item of items) {
      await mixtureCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        { $set: { availability: 'Rented' } }
      );
    }

    res.status(201).json({ 
      message: 'Order placed successfully', 
      orderId: result.insertedId 
    });
  } catch (error) {
    console.error('Failed to place order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  } finally {
    if (client) client.close();
  }
});

// Optional: GET /orders - Fetch user's orders (for reference)
ordersRoutes.get('/', async (req, res) => {
  const userId = req.query.userId; // Assuming userId is passed as query param
  if (!userId) {
    return res.status(400).json({ message: 'User ID required' });
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');

    const orders = await ordersCollection.find({ userId: new ObjectId(userId) }).toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  } finally {
    if (client) client.close();
  }
});

export default ordersRoutes;
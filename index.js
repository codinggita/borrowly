// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { MongoClient } from "mongodb";
// import accessoriesRoutes from "./product/accessories.js";
// import clothesRoutes from "./product/clothes.js";
// import footwearsRoutes from "./product/footwears.js";
// import mixtureRoutes from "./product/mixture.js";
// import userRoutes from "./product/signup.js";
// import loginRoutes from "./product/login.js";
// import formRoutes from "./product/form.js";
// import cartRoutes from "./product/cart.js";
// import wishlistRoutes from "./product/wishlist.js";
// import ordersRoutes from "./product/orders.js";


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 7000;
// app.use(cors())

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// app.use('/accessories',accessoriesRoutes)
// app.use('/clothes',clothesRoutes)
// app.use('/footwears',footwearsRoutes)
// app.use('/mixture',mixtureRoutes)
// app.use('/',userRoutes) //post route for signup
// app.use('/', loginRoutes); //post route for login
// app.use('/', formRoutes);
// app.use('/cart',cartRoutes);
// app.use('/wishlist',wishlistRoutes);
// app.use('/orders',ordersRoutes)

// const uri = 'mongodb+srv://test:test123@cluster0.cmvmn.mongodb.net/';
//  // Local MongoDB URI
// const dbName = 'products';  // Database name

// MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     console.log('Connected to MongoDB');
//     // const db = client.db(dbName);
//     // const usersCollection = db.collection('users');  // Access your collection

//     app.get('/', (req, res) => {
//       res.send('Welcome to Borrowly!');
//     });

//     // Add your routes and MongoDB queries here

//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB', err);
//   });

// app.get('/', (req, res) => {
//     res.send('Welcome to Borrowly API');
// });


// app.listen(PORT,()=>{
//     console.log(`Server running on ${PORT}`);
// })


// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import accessoriesRoutes from "./product/accessories.js";
import clothesRoutes from "./product/clothes.js";
import footwearsRoutes from "./product/footwears.js";
import mixtureRoutes from "./product/mixture.js";
import userRoutes from "./product/signup.js";
import loginRoutes from "./product/login.js";
import formRoutes from "./product/form.js";
import cartRoutes from "./product/cart.js";
import wishlistRoutes from "./product/wishlist.js";
import ordersRoutes from "./product/orders.js";
import reviewRoutes from "./product/reviewRoutes.js"; // Add this line

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Existing routes
app.use('/accessories', accessoriesRoutes);
app.use('/clothes', clothesRoutes);
app.use('/footwears', footwearsRoutes);
app.use('/mixture', mixtureRoutes);
app.use('/', userRoutes);
app.use('/', loginRoutes);
app.use('/', formRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/orders', ordersRoutes);
app.use('/', reviewRoutes); // Add this line

const uri = 'mongodb+srv://test:test123@cluster0.cmvmn.mongodb.net/';
const dbName = 'products';

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    app.get('/', (req, res) => {
      res.send('Welcome to Borrowly!');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

app.get('/', (req, res) => {
    res.send('Welcome to Borrowly API');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
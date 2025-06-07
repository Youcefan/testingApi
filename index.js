const express = require("express");
const mongoose = require("mongoose");  
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const urlDb = process.env.MONGO_URL;
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const shippingRoutes = require("./routes/ShippingRoutes")

mongoose
  .connect(urlDb)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/shipping", shippingRoutes);

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

require("dotenv").config();
const crypto = require("crypto");
global.crypto = crypto;
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

async function createData() {
  await Product.deleteMany();

  await Product.insertMany([
    {
      name: "iPhone 15",
      price: 25000000,
      stock: 100,
      description: "Apple flagship",
    },
    {
      name: "Laptop Gaming",
      price: 30000000,
      stock: 50,
      description: "High performance",
    },
    {
      name: "Tai nghe Bluetooth",
      price: 500000,
      stock: 200,
      description: "Wireless headphone",
    },
  ]);

  console.log("✅ MongoDB seeded");
  process.exit();
}

createData();
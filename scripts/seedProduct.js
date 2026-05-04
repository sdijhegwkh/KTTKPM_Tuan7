require("dotenv").config();
const crypto = require("crypto");
global.crypto = crypto;
const mongoose = require("mongoose");
const Redis = require("ioredis");

// Redis
const redis = new Redis({
  host: "172.16.69.167", // sửa IP Redis
  port: 6379,
});

// MongoDB
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

// Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

async function seedToRedis() {
  try {
    const products = await Product.find();

    console.log(`Found ${products.length} products`);

    const pipeline = redis.pipeline();

    // clear dữ liệu cũ
    pipeline.del("products");

    products.forEach((p) => {
      const productData = {
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        stock: p.stock,
        description: p.description,
      };

      // list id
      pipeline.rpush("products", productData.id);

      // object
      pipeline.set(
        `product:${productData.id}`,
        JSON.stringify(productData)
      );

      // stock riêng (quan trọng cho Inventory PU)
      pipeline.set(`stock:${productData.id}`, productData.stock);
    });

    await pipeline.exec();

    console.log("✅ Seeded to Redis successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedToRedis();
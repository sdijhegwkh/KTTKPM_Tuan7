const express = require("express");
const cors = require("cors");
const productService = require("./productService");

const app = express();

// QUAN TRỌNG
app.use(cors());
app.use(express.json());

const PORT = 8081;

// GET /products
app.get("/products", async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id
app.get("/products/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Product PU running at http://localhost:${PORT}`);
});

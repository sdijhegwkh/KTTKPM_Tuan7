const redis = require("./redisClient");
const cache = require("./cache");

const PRODUCT_LIST_KEY = "products";
const PRODUCT_KEY = (id) => `product:${id}`;

// ===============================
// GET ALL PRODUCTS
// ===============================
async function getAllProducts() {
  const cacheKey = "all_products";

  // 1. Check local cache
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 2. Load danh sách id từ Redis
  const productIds = await redis.lrange(PRODUCT_LIST_KEY, 0, -1);

  if (!productIds.length) return [];

  // 3. Pipeline lấy product
  const pipeline = redis.pipeline();

  productIds.forEach((id) => {
    pipeline.get(PRODUCT_KEY(id));
  });

  const results = await pipeline.exec();

  const products = [];

  // 4. Parse product + lấy stock realtime
  for (const [err, data] of results) {
    if (!data) continue;

    const product = JSON.parse(data);

    // realtime stock từ Inventory Data Grid
    const realtimeStock = await redis.get(`stock:${product.id}`);

    product.stock = Number(realtimeStock || 0);

    products.push(product);
  }

  // 5. Save local cache
  cache.set(cacheKey, products);

  return products;
}

// ===============================
// GET PRODUCT BY ID
// ===============================
async function getProductById(id) {
  const cacheKey = `product_${id}`;

  // 1. Check local cache
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 2. Load product từ Redis
  const data = await redis.get(PRODUCT_KEY(id));

  if (!data) return null;

  const product = JSON.parse(data);

  // 3. Lấy stock realtime
  const realtimeStock = await redis.get(`stock:${product.id}`);

  product.stock = Number(realtimeStock || 0);

  // 4. Cache lại
  cache.set(cacheKey, product);

  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
};

const redis = require("./redisClient");
const cache = require("./cache");

const PRODUCT_LIST_KEY = "products"; // list id
const PRODUCT_KEY = (id) => `product:${id}`;

// GET ALL PRODUCTS
async function getAllProducts() {
  const cacheKey = "all_products";

  // 1. check cache local
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 2. load từ Redis
  const productIds = await redis.lrange(PRODUCT_LIST_KEY, 0, -1);

  if (!productIds.length) return [];

  const pipeline = redis.pipeline();

  productIds.forEach((id) => {
    pipeline.get(PRODUCT_KEY(id));
  });

  const results = await pipeline.exec();

  const products = results.map(([err, data]) =>
    data ? JSON.parse(data) : null
  ).filter(Boolean);

  // 3. save cache local
  cache.set(cacheKey, products);

  return products;
}

// GET PRODUCT BY ID
async function getProductById(id) {
  const cacheKey = `product_${id}`;

  // 1. cache local
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 2. Redis
  const data = await redis.get(PRODUCT_KEY(id));

  if (!data) return null;

  const product = JSON.parse(data);

  // 3. cache lại
  cache.set(cacheKey, product);

  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
};
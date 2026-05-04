const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1", // IP Redis của bạn
  port: 6379,
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

module.exports = redis;
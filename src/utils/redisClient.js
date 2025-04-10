// utils/redisClient.js
const redis = require("redis");
const client = redis.createClient({
    socket: {
      host: "127.0.0.1",
      port: 6379
    }
  });

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.connect(); // redis@4+

module.exports = client;

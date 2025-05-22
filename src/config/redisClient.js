/* eslint-disable no-unused-vars */
// utils/redisClient.js
/* eslint-disable no-undef */
const { createClient } = require("redis");

async function initRedis() {
  if (!global.redisClient) {
    const client = createClient({
      username: process.env.REDIS_UNAME,
      password: process.env.REDIS_PASS,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    });

    client.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    if (!client.isOpen) {
      await client.connect();
    }

    global.redisClient = client;
    console.log("Redis initialized globally");
  }

  return global.redisClient;
}

async function getRedis() {
  if (!global.redisClient || !global.redisClient.isOpen) {
    await initRedis();
  }
  return global.redisClient;
}

module.exports = { initRedis, getRedis };

/* eslint-disable no-undef */
const { createClient } = require('redis');

let redisClient;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASS || undefined,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }

  return redisClient;
}

module.exports = { getRedisClient };

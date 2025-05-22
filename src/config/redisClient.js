/* eslint-disable no-undef */
const { createClient } = require('redis');

let redisClient;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      username: process.env.REDIS_UNAME,
      password: process.env.REDIS_PASS,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT), // pastikan ini number ya
      },
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

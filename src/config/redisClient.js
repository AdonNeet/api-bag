/* eslint-disable no-undef */
const { createClient } = require('redis');

const client = createClient({
  username: process.env.REDIS_UNAME,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

// konek di luar supaya siap dipakai
(async () => {
  await client.connect();
})();

module.exports = client;

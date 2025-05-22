/* eslint-disable no-undef */
const { createClient } = require('redis');

(async () => {
    const client = createClient({
        username: process.env.REDIS_UNAME,
        password: process.env.REDIS_PASS,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('foo', 'bar');
    const result = await client.get('foo');
    console.log(result); // bar
})();

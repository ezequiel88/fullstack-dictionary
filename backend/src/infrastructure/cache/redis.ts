import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect()
    .then(() => {
        console.log('Redis client connected');
    })
    .catch(err => {
        console.log('Redis client connection failed', err);
    });

export default redisClient;
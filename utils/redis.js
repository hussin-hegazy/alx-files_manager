// utils/redis.js

import redis from 'redis';

class RedisClient {
    constructor() {
        // Create the Redis client
        this.client = redis.createClient();

        // Log any Redis connection errors
        this.client.on('error', (err) => {
            console.error('Redis error: ', err);
        });
    }

    // Check if Redis client is connected
    isAlive() {
        return this.client.connected;
    }

    // Get the value of a Redis key
    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    // Set a key-value pair in Redis with expiration duration
    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, duration, value, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    // Delete a Redis key
    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

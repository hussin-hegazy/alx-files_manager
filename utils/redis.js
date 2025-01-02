// utils/redis.js
import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * A service for managing Redis interactions.
 */
class RedisManager {
  /**
   * Constructs a RedisManager instance with an active Redis client.
   */
  constructor() {
    this.redisClient = createClient();
    this.isConnected = false;

    this.redisClient.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to Redis');
    });

    this.redisClient.on('error', (error) => {
      this.isConnected = false;
      console.error('Redis connection error:', error.message || error.toString());
    });
  }

  /**
   * Checks if the Redis connection is currently active.
   * @returns {boolean} Whether the client is connected to Redis.
   */
  checkConnection() {
    return this.isConnected;
  }

  /**
   * Retrieves the value for a given key from Redis.
   * @param {String} key The key for the item to retrieve.
   * @returns {Promise<String | Object>} The stored value.
   */
  async fetchValue(key) {
    return promisify(this.redisClient.GET).bind(this.redisClient)(key);
  }

  /**
   * Sets a value in Redis with a specific expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} ttl The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async storeValue(key, value, ttl) {
    await promisify(this.redisClient.SETEX).bind(this.redisClient)(key, ttl, value);
  }

  /**
   * Deletes a key from Redis.
   * @param {String} key The key to delete.
   * @returns {Promise<void>}
   */
  async removeKey(key) {
    await promisify(this.redisClient.DEL).bind(this.redisClient)(key);
  }
}

const redisManager = new RedisManager();
export default redisManager;

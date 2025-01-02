// utils/redis.js
import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * A class for managing Redis interactions.
 */
class RedisHandler {
  /**
   * Initializes the Redis client and sets up event listeners.
   */
  constructor() {
    this.client = createClient();
    this.connectionStatus = false;

    this.client.on('connect', () => {
      this.connectionStatus = true;
    });

    this.client.on('error', (error) => {
      console.error('Error connecting to Redis:', error.message || error.toString());
      this.connectionStatus = false;
    });
  }

  /**
   * Returns whether the client is connected to Redis.
   * @returns {boolean}
   */
  isConnected() {
    return this.connectionStatus;
  }

  /**
   * Gets the value associated with the provided key.
   * @param {String} key The Redis key.
   * @returns {Promise<String | Object>}
   */
  async getValue(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key-value pair in Redis with a specific expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} ttl Time-to-live in seconds.
   * @returns {Promise<void>}
   */
  async setValue(key, value, ttl) {
    await promisify(this.client.SETEX).bind(this.client)(key, ttl, value);
  }

  /**
   * Removes a key-value pair from Redis.
   * @param {String} key The key to remove.
   * @returns {Promise<void>}
   */
  async removeValue(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisHandler = new RedisHandler();
export default redisHandler;

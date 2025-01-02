import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Redis client for interacting with a Redis server.
 */
class RedisService {
  /**
   * Initializes a new RedisService instance.
   */
  constructor() {
    this.client = createClient();
    this.isConnected = false;
    this.client.on('error', (err) => {
      console.error('Failed to connect to Redis server:', err.message || err.toString());
      this.isConnected = false;
    });
    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * Checks the current connection status to the Redis server.
   * @returns {boolean}
   */
  checkConnection() {
    return this.isConnected;
  }

  /**
   * Fetches the value associated with the given key.
   * @param {string} key The key for the data to retrieve.
   * @returns {string | object}
   */
  async fetch(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key-value pair in Redis with an expiration time.
   * @param {string} key The key of the data to store.
   * @param {string | number | boolean} value The value to associate with the key.
   * @param {number} ttl The time-to-live in seconds for the key.
   * @returns {Promise<void>}
   */
  async store(key, value, ttl) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, ttl, value);
  }

  /**
   * Deletes the key and its associated value.
   * @param {string} key The key to remove.
   * @returns {Promise<void>}
   */
  async remove(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisService = new RedisService();
export default redisService;

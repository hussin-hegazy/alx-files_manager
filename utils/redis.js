// utils/redis.js
import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * A service for interacting with Redis.
 */
class RedisService {
  /**
   * Initializes a new RedisService instance.
   */
  constructor() {
    this.client = createClient();
    this.connected = false;

    // Event listeners for Redis client connection status
    this.client.on('connect', () => {
      this.connected = true;
    });

    this.client.on('error', (err) => {
      console.error('Failed to connect to Redis:', err.message || err.toString());
      this.connected = false;
    });
  }

  /**
   * Verifies if the Redis client is currently connected.
   * @returns {boolean}
   */
  checkConnection() {
    return this.connected;
  }

  /**
   * Retrieves the value for the given key from Redis.
   * @param {String} key The key to retrieve the value for.
   * @returns {Promise<String | Object>}
   */
  async fetch(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Sets a key-value pair in Redis with an expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} ttl The time-to-live for the key in seconds.
   * @returns {Promise<void>}
   */
  async store(key, value, ttl) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, ttl, value);
  }

  /**
   * Deletes the specified key from Redis.
   * @param {String} key The key to delete.
   * @returns {Promise<void>}
   */
  async remove(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisService = new RedisService();
export default redisService;

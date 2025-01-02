// utils/redis.js
import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Redis client wrapper class.
 */
class RedisService {
  /**
   * Initializes a new instance of RedisService.
   */
  constructor() {
    this.client = createClient();
    this.connected = true;

    this.client.on('error', (err) => {
      console.error('Failed to connect to Redis:', err.message || err.toString());
      this.connected = false;
    });

    this.client.on('connect', () => {
      this.connected = true;
    });
  }

  /**
   * Verifies whether the client is connected to the Redis server.
   * @returns {boolean}
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Fetches the value associated with a given key.
   * @param {String} key The key to fetch the value for.
   * @returns {String | Object}
   */
  async getValue(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key-value pair in Redis with an expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} ttl Time-to-live in seconds.
   * @returns {Promise<void>}
   */
  async setValue(key, value, ttl) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, ttl, value);
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

export const redisService = new RedisService();
export default redisService;

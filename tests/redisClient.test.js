import { expect } from 'chai';
import redisClient from '../utils/redis';

describe('RedisClient', () => {
  // اختبار اتصال Redis
  it('should check if Redis connection is alive', () => {
    expect(redisClient.isAlive()).to.be.true;
  });

  // اختبار تخزين واسترجاع قيمة
  it('should set and get a value from Redis', async () => {
    await redisClient.set('testKey', 'testValue', 10);
    const value = await redisClient.get('testKey');
    expect(value).to.equal('testValue');
  });

  // اختبار حذف قيمة
  it('should delete a value from Redis', async () => {
    await redisClient.set('testKey', 'testValue', 10);
    await redisClient.del('testKey');
    const value = await redisClient.get('testKey');
    expect(value).to.be.null;
  });
});

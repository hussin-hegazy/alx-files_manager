const mongoose = require('mongoose');
const redis = require('redis');

// Utility functions to check Redis and DB
const checkRedis = () => {
  const client = redis.createClient();
  return new Promise((resolve, reject) => {
    client.ping((err, result) => {
      if (err) reject(err);
      resolve(result === 'PONG');
    });
  });
};

const checkDB = async () => {
  try {
    const status = await mongoose.connection.db.admin().ping();
    return status.ok === 1;
  } catch (err) {
    return false;
  }
};

module.exports.getStatus = async (req, res) => {
  try {
    const redisStatus = await checkRedis();
    const dbStatus = await checkDB();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  } catch (error) {
    res.status(500).json({ error: 'Unable to check services status' });
  }
};

module.exports.getStats = async (req, res) => {
  try {
    const usersCount = await mongoose.model('User').countDocuments();
    const filesCount = await mongoose.model('File').countDocuments();
    res.status(200).json({ users: usersCount, files: filesCount });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch stats' });
  }
};

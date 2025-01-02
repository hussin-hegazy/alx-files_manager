// utils/db.js

import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for performing operations with Mongo service.
 */
class DBClient {
  /**
   * Creates a new DBClient instance and connects to MongoDB.
   */
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.log(err.message);
        this.db = false;
      }
    });
  }

  /**
   * Checks if connection to MongoDB is alive.
   * @returns {boolean} true if connection is alive, false otherwise.
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Returns the number of documents in the collection 'users'.
   * @returns {Promise<number>} The number of users.
   */
  async nbUsers() {
    const numberOfUsers = await this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  /**
   * Returns the number of documents in the collection 'files'.
   * @returns {Promise<number>} The number of files.
   */
  async nbFiles() {
    const numberOfFiles = await this.filesCollection.countDocuments();
    return numberOfFiles;
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();

export default dbClient;

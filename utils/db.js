import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const connectionUrl = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * MongoDB client class to interact with the database
 */
class DBClient {
  constructor() {
    MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
      if (!error) {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.error(`Failed to connect: ${error.message}`);
        this.db = null;
      }
    });
  }

  /**
   * Checks if the MongoDB client is connected
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Retrieves the count of documents in the users collection
   * @returns {Promise<number>} The number of users
   */
  async getUserCount() {
    return this.usersCollection.countDocuments();
  }

  /**
   * Retrieves the count of documents in the files collection
   * @returns {Promise<number>} The number of files
   */
  async getFileCount() {
    return this.filesCollection.countDocuments();
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;

import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const connectionURL = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for handling operations with MongoDB.
 */
class MongoDBService {
  constructor() {
    MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
      if (!error) {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.error(`Connection failed: ${error.message}`);
        this.db = null;
      }
    });
  }

  /**
   * Verifies if the connection to MongoDB is active.
   * @returns {boolean} true if connected, otherwise false.
   */
  isConnected() {
    return this.db !== null;
  }

  /**
   * Gets the count of documents in the users collection.
   * @returns {Promise<number>} The number of users.
   */
  async getUsersCount() {
    return this.usersCollection.countDocuments();
  }

  /**
   * Gets the count of documents in the files collection.
   * @returns {Promise<number>} The number of files.
   */
  async getFilesCount() {
    return this.filesCollection.countDocuments();
  }
}

const mongoDBService = new MongoDBService();

export default mongoDBService;

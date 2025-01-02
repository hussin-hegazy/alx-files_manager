import { MongoClient } from 'mongodb';

// Get environment variables or use default values
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const connectionString = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * MongoDB client class to interact with the database
 */
class DBClient {
  constructor() {
    MongoClient.connect(connectionString, { useUnifiedTopology: true }, (error, client) => {
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
   * Checks if the MongoDB client is connected
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return this.db !== null;
  }

  /**
   * Retrieves the count of users in the users collection
   * @returns {Promise<number>} The number of users
   */
  async nbUsers() {
    const userCount = await this.usersCollection.countDocuments();
    return userCount;
  }

  /**
   * Retrieves the count of files in the files collection
   * @returns {Promise<number>} The number of files
   */
  async nbFiles() {
    const fileCount = await this.filesCollection.countDocuments();
    return fileCount;
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;

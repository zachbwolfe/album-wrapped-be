const { MongoClient, ServerApiVersion } = require('mongodb');


class TableManager {


  constructor() {
    // Connection URL
    // const local = 'mongodb://localhost:27017'; // Change this URL based on your MongoDB server configuration
    // this.client = new MongoClient(local, { useNewUrlParser: true, useUnifiedTopology: true });
    const tlsCertificateKeyFile = process.env.TLS_CERTIFICATE_KEY_FILE;
    // const tlsCertificateKeyFile = './X509-cert-5841951255022245067.pem';
    const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
    // const mongoConnectionString = 'mongodb+srv://zwolfecluster.27mqexa.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority'
    this.client = new MongoClient(mongoConnectionString, {
      tlsCertificateKeyFile: tlsCertificateKeyFile,
      serverApi: ServerApiVersion.v1
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
    const dbName = 'listens'; // Change this to your database name
    this.db = this.client.db(dbName);

    const tableName = "listens"
    this.table = this.db.collection(tableName);
    console.log("what?");
  }

  async close() {
    try {
      await this.client.close();
      console.log('Closed MongoDB connection');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }

  // Use connect method to connect to the server


  async insert(
    albumName,
    artist
  ) {
    console.log("inserting!");
    console.log(albumName);
    console.log(artist);
    const timestamp = new Date().getTime();

    const resp = this.table.insertOne({
      albumName: albumName,
      artist: artist,
      timestamp: timestamp
    });
    const data = await Promise.resolve(resp);
    return data;
  }

  async remove(
    albumName,
    artist,
    timestamp
  ) {
    console.log("removing!");
    console.log({
      albumName: albumName,
      artist: artist,
      timestamp: timestamp
    });
    const resp = this.table.deleteOne({
      albumName: albumName,
      artist: artist,
      timestamp: timestamp
    });
    const data = await Promise.resolve(resp);
    return data;
  }

  async get() {
    console.log("getting!");
    const resp = this.table.find().toArray();
    const [data] = await Promise.all([resp]);
    console.log(data);
    return data;
  }
}

module.exports = TableManager

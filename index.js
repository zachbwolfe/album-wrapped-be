const TableManager = require('./tableManager');

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const manager = new TableManager();

app.use(express.json());

const allowedOrigins = ['http://localhost:3001', 'https://peaceful-kangaroo-e8f122.netlify.app'];
app.use(cors({ origin: allowedOrigins }));

manager.connect()
  .then(() => {
    // Set up your routes and other middleware here
    app.get('/', async (req, res) => {
      console.log("fetching!");
      const resp = await manager.get();
      res.json(resp);
    });

    app.post('/upsert', async (req, res) => {
      console.log("api inserting!");
      const resp = await manager.insert(
        req.body.albumName,
        req.body.artist
      )
      res.json(resp);
    });

    app.delete('/delete', async (req, res) => {
      console.log("api deleting!");
      const resp = await manager.remove(
        req.body.albumName,
        req.body.artist,
        req.body.timestamp
      )
      res.json(resp);
    });

    // Start the server
    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });

    // Handle server shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      // Close the MongoDB connection before exiting
      await manager.close();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });


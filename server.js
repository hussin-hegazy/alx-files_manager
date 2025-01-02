const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Load routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

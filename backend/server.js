const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.json({ limit: '200mb' }));  // Increase limit for large JSON payloads
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// CORS configuration (before routes)
app.use(cors({
  origin: '*', // If you don't need credentials, this works
  methods: ['GET', 'PUT', 'POST', 'DELETE'], // Optional, to specify allowed methods
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/attendance-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define routes
app.use('/api/students', studentRoutes);

// Example route
app.get('/', async (req, res) => {
  return res.json("How");
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

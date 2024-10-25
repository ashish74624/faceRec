// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'PUT', 'POST', 'DELETE'], // Optional, to specify allowed methods
}));
app.use(bodyParser.json({ limit: '200mb' })); // Increase body size limit
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/attendance-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

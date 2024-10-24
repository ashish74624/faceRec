// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  faceData: Array, // To store face embeddings
});

module.exports = mongoose.model('Student', studentSchema);

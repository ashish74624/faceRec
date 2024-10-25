// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faceData: { type: [Number], required: true },
});

module.exports = mongoose.model('Student', studentSchema);

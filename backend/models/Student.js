const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faceData: { type: [[Number]], required: true }, // Now stores an array of face descriptors
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

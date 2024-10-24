const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faceData: { type: Array, required: true } // This stores the face descriptor array
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

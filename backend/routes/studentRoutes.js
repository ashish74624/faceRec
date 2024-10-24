// routes/studentRoutes.js
const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Register student
router.post('/register', async (req, res) => {
  const { name, faceData } = req.body;
  const newStudent = new Student({ name, faceData });
  await newStudent.save();
  res.json({ message: 'Student registered successfully' });
});

// Recognize student
router.post('/recognize', async (req, res) => {
  const { faceData } = req.body;

  const students = await Student.find();
  let recognizedStudent = null;

  // Compare faceData with registered students
  for (let student of students) {
    const isMatch = faceData.some((embedding, idx) => {
      return student.faceData[idx] && faceapi.euclideanDistance(student.faceData[idx], embedding) < 0.6;
    });

    if (isMatch) {
      recognizedStudent = student;
      break;
    }
  }

  if (recognizedStudent) {
    res.json({ message: 'Student recognized', student: recognizedStudent });
  } else {
    res.json({ message: 'No match found' });
  }
});

module.exports = router;

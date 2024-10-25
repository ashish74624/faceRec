// studentRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Register a new student
// studentRoutes.js
router.post('/register', async (req, res) => {
  const { name, descriptors } = req.body;

  try {
    const student = new Student({
      name,
      faceData: descriptors,  // store multiple descriptors
    });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register student' });
  }
});


// Recognize a student
router.post('/recognize', async (req, res) => {
  const { faceData } = req.body;
  const students = await Student.find();
  
  let recognizedStudent = null;
  const threshold = 0.6; // Euclidean distance threshold

  for (const student of students) {
    const distance = euclideanDistance(faceData, student.faceData);
    if (distance < threshold) {
      recognizedStudent = student;
      break;
    }
  }

  if (recognizedStudent) {
    res.json({ student: recognizedStudent });
  } else {
    res.json({ student: null });
  }
});

// Calculate Euclidean distance
function euclideanDistance(arr1, arr2) {
  return Math.sqrt(arr1.reduce((sum, value, index) => sum + Math.pow(value - arr2[index], 2), 0));
}

module.exports = router;

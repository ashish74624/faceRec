const express = require('express');
const router = express.Router();
const faceapi = require('face-api.js'); // Assuming face-api.js is set up in your project
const Student = require('../models/Student'); // Assuming you have a Student model

// Helper function to get stored students from your database
const getStoredStudents = async () => {
  // Fetch all registered students from the database (including face descriptors)
  return await Student.find({}, 'name faceData');
};

// Route to register a new student
router.post('/register', async (req, res) => {
  const { name, faceData } = req.body;
  
  try {
    // Create a new student with face descriptor
    const newStudent = new Student({ name, faceData });
    await newStudent.save();
    
    res.json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering student' });
  }
});

// Route to recognize a student
router.post('/recognize', async (req, res) => {
  const { faceData } = req.body;

  try {
    const storedStudents = await getStoredStudents();
    const queryFace = Array.isArray(faceData) ? faceData : Array.from(faceData);

    let recognizedStudent = null;

    for (let student of storedStudents) {
      const storedFaceDescriptors = student.faceData;

      // Compare against all stored face descriptors
      for (let storedFaceData of storedFaceDescriptors) {
        const isMatch = faceapi.euclideanDistance(queryFace, storedFaceData) < 0.8; // Adjust threshold as needed

        if (isMatch) {
          recognizedStudent = student;
          break;
        }
      }

      if (recognizedStudent) {
        break;
      }
    }

    if (recognizedStudent) {
      res.json({ student: recognizedStudent });
    } else {
      res.json({ student: null, message: 'No match found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error recognizing student' });
  }
});


module.exports = router;

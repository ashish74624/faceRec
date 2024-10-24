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
  const { faceData } = req.body; // This is the descriptor sent from the frontend

  try {
    // Get stored students and their face descriptors
    const storedStudents = await getStoredStudents();

    // Convert incoming face descriptor to array (if it's not already an array)
    const queryFace = Array.isArray(faceData) ? faceData : Array.from(faceData);

    console.log('Query face descriptor length:', queryFace.length);

    let recognizedStudent = null;

    for (let student of storedStudents) {
      const storedFaceData = Array.isArray(student.faceData) ? student.faceData : Array.from(student.faceData);

      console.log(`Stored face descriptor length for student ${student.name}:`, storedFaceData.length);

      // Check if the descriptor lengths match before comparison
      if (queryFace.length !== storedFaceData.length) {
        console.error('Descriptor length mismatch:', queryFace.length, storedFaceData.length);
        continue; // Skip this student if the lengths don't match
      }

      // Using Euclidean distance to match the descriptors
      const isMatch = faceapi.euclideanDistance(queryFace, storedFaceData) < 0.9;

      if (isMatch) {
        recognizedStudent = student;
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

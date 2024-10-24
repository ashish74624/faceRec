const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cv = require('opencv4nodejs');
const Face = require('./models/Face');  // MongoDB model

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Store with timestamp
  },
});
const upload = multer({ storage });

// Route to register a new face
router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const image = cv.imread(req.file.path);
    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    
    // Detect faces
    const faces = classifier.detectMultiScale(image).objects;

    if (!faces.length) {
      return res.status(400).send('No face detected.');
    }

    // Crop the first detected face
    const faceRegion = image.getRegion(faces[0]);
    const faceData = faceRegion.resize(150, 150);  // Resize for consistency
    const faceEncoding = faceData.getDataAsArray(); // Get pixel data

    // Save face encoding and reference to the image in MongoDB
    const newFace = new Face({ name: req.body.name, encoding: faceEncoding, image: req.file.path });
    await newFace.save();

    res.send('Face registered successfully!');
  } catch (err) {
    res.status(500).send('Error registering face.');
  }
});

// Route to recognize a face
router.post('/recognize', upload.single('image'), async (req, res) => {
  try {
    const image = cv.imread(req.file.path);
    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    
    // Detect faces
    const faces = classifier.detectMultiScale(image).objects;

    if (!faces.length) {
      return res.status(400).send('No face detected.');
    }

    // Crop the first detected face
    const faceRegion = image.getRegion(faces[0]);
    const faceData = faceRegion.resize(150, 150);  // Resize for consistency
    const faceEncoding = faceData.getDataAsArray();

    // Fetch all registered faces from MongoDB
    const registeredFaces = await Face.find();
    
    // Simple comparison by calculating Euclidean distance between pixel values
    let recognizedFace = null;
    registeredFaces.forEach((registered) => {
      const dist = cv.norm(new cv.Mat(registered.encoding), new cv.Mat(faceEncoding), cv.NORM_L2);
      if (dist < 0.6) {  // Threshold for recognition
        recognizedFace = registered;
      }
    });

    if (recognizedFace) {
      res.send(`Face recognized: ${recognizedFace.name}`);
    } else {
      res.send('Face not recognized.');
    }
  } catch (err) {
    res.status(500).send('Error recognizing face.');
  }
});

module.exports = router;

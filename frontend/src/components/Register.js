// RegisterStudent.js
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import axios from 'axios';

const RegisterStudent = () => {
  const [descriptors, setDescriptors] = useState([]);
  const [detector, setDetector] = useState(null);
  const maxCaptures = 20; // Max images to capture
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        { runtime: 'tfjs' }
      );
      setDetector(model);
    };

    const setupWebcam = async () => {
      const video = document.getElementById('video');

      if (navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          await video.play();
        } catch (err) {
          console.error('Error accessing webcam:', err);
          alert('Error accessing webcam.');
        }
      }
    };

    loadModel();
    setupWebcam();
  }, []);

  const captureFaceData = async () => {
    const video = document.getElementById('video');
    if (!detector) {
      alert('Model not loaded yet');
      return;
    }

    const faces = await detector.estimateFaces(video);
    if (faces.length > 0) {
      const faceData = faces[0].keypoints.map(point => [point.x, point.y]);
      setDescriptors(prev => [...prev, faceData]);
      console.log(`Captured image ${descriptors.length + 1}`);
    } else {
      console.log('No face detected. Trying again...');
    }
  };

  const startCapturing = async () => {
    setIsCapturing(true);
    const interval = setInterval(() => {
      if (descriptors.length < maxCaptures) {
        captureFaceData();
      } else {
        clearInterval(interval);
        setIsCapturing(false);
        alert('Captured 20 images successfully.');
      }
    }, 1000); // Capture an image every second
  };

  const handleRegister = async () => {
    const name = prompt('Enter student name:');
    await axios.post('http://localhost:5000/api/students/register', { name, descriptors });
    alert('Student registered with multiple images successfully');
  };

  return (
    <div>
      <video id="video" autoPlay muted width="720" height="560" style={{ border: '1px solid black' }} />
      <button onClick={startCapturing} disabled={isCapturing}>Start Capturing</button>
      <button onClick={handleRegister} disabled={descriptors.length === 0}>Register Student</button>
      <p>Captured Images: {descriptors.length}/{maxCaptures}</p>
    </div>
  );
};

export default RegisterStudent;

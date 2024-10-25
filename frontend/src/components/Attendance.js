// RecognizeStudent.js
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import axios from 'axios';

const RecognizeStudent = () => {
  const [detector, setDetector] = useState(null);

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
          video.play();
        } catch (err) {
          console.error('Error accessing webcam:', err);
          alert('Error accessing webcam.');
        }
      }
    };

    loadModel();
    setupWebcam();
  }, []);

  const handleRecognize = async () => {
    const video = document.getElementById('video');
    if (!detector) {
      alert('Model not loaded yet');
      return;
    }

    const faces = await detector.estimateFaces(video);
    if (faces.length === 0) {
      alert('No face detected');
      return;
    }

    const faceData = faces[0].keypoints.map(point => [point.x, point.y]);
    try {
      const response = await axios.post('http://localhost:5000/api/students/recognize', { faceData });
      if (response.data.student) {
        alert(`Student recognized: ${response.data.student.name}`);
      } else {
        alert('No match found');
      }
    } catch (error) {
      console.error('Recognition error:', error);
      alert('Error in recognition. Please try again.');
    }
  };

  return (
    <div>
      <video id="video" autoPlay muted width="720" height="560" style={{ border: '1px solid black' }} />
      <button onClick={handleRecognize}>Recognize Student</button>
    </div>
  );
};

export default RecognizeStudent;

// RecognizeStudent.js
import React, { useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
const RecognizeStudent = () => {
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const handleRecognize = async () => {
    const video = document.getElementById('video');
    const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      alert('No face detected');
      return;
    }
    const faceData = detection.descriptor;
    const response = await axios.post('/api/students/recognize', { faceData });
    if (response.data.student) {
      alert(`Student recognized: ${response.data.student.name}`);
    } else {
      alert('No match found');
    }
  };

  return (
    <div>
      <video id="video" autoPlay muted width="720" height="560" />
      <button onClick={handleRecognize}>Recognize Student</button>
    </div>
  );
};

export default RecognizeStudent;

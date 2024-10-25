import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

const RegisterStudent = () => {
  const videoRef = useRef();
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models from the provided URL
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setIsModelsLoaded(true); // Mark models as loaded
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream; // Attach the video stream to the video element
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
        });
    };

    loadModels();
    startVideo();
  }, []);

 const handleRegister = async () => {
  const video = document.getElementById('video');
  const faceDescriptors = [];

  // Capture multiple face descriptors
  for (let i = 0; i < 20; i++) { // Number of snapshots can be adjusted
    const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
    if (detection) {
      faceDescriptors.push(detection.descriptor);
    }
  }

  const name = prompt('Enter student name:');
  if (faceDescriptors.length > 0) {
    await axios.post('http://localhost:5000/api/students/register', { name, faceDescriptors });
    alert('Student registered successfully');
  } else {
    alert('No faces detected for registration');
  }
};


  return (
    <div>
      <video
        ref={videoRef}
        id="video"
        autoPlay
        muted
        width="720"
        height="560"
        style={{ border: '1px solid black' }}
      />
      <button onClick={handleRegister}>Register Student</button>
    </div>
  );
};

export default RegisterStudent;

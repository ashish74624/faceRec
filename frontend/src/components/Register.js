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
    if (!isModelsLoaded) {
      alert('Face models are not yet loaded. Please wait.');
      return;
    }

    const video = videoRef.current;
    const detection = await faceapi.detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detection) {
      alert('No face detected');
      return;
    }

    const faceData = detection.descriptor;
    const name = prompt('Enter student name:');
    
    try {
      await axios.post('http://localhost:5000/api/students/register', { name, faceData });
      alert('Student registered successfully');
    } catch (error) {
      console.error('Error registering student:', error);
      alert('Error registering student.');
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

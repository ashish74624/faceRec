import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

const RecognizeStudent = () => {
  const videoRef = useRef();
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models for face detection, landmarks, and recognition
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setIsModelsLoaded(true); // Models are successfully loaded
      } catch (error) {
        console.error('Error loading face-api models:', error);
      }
    };

    const startVideo = () => {
      // Start the video stream from the camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream; // Attach stream to video element
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
        });
    };

    loadModels();
    startVideo();
  }, []);

  const handleRecognize = async () => {
  const video = document.getElementById('video');
  const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

  if (!detection) {
    alert('No face detected. Please try again.');
    return;
  }

  const faceData = detection.descriptor;
  const response = await axios.post('http://localhost:5000/api/students/recognize', { faceData });

  if (response.data.student) {
    alert(`Student recognized: ${response.data.student.name}`);
  } else {
    alert('No match found. Try again or register if not registered.');
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
      <button onClick={handleRecognize}>Recognize Student</button>
    </div>
  );
};

export default RecognizeStudent;

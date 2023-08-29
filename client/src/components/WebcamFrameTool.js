import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as faceapi from "face-api.js";

import ImageService from "../services/ImageService";
import PreviewImage from "./PreviewImage";
import ResultImage from "./ResultImage";

const imageService = new ImageService();

const WebcamFrameTool = () => {
  const webcamRef = useRef(null);
  const [resultImage, setResultImage] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [showResultImage, setShowResultImage] = useState(true);
  let detectionsObject;

  useEffect(() => {
    startCamera();
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      faceMyDetect();
    };

    loadModels();
    imageService.socket.on("result", (dataUrl) => {
      setResultImage(dataUrl.data);
      setShowButtons(true);
    });

    const handleBeforeUnload = () => imageService.deleteImage();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const faceMyDetect = async () => {
    const detections = await faceapi
      .detectAllFaces(webcamRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    detectionsObject = detections[0];
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error(err.message, { position: toast.POSITION.BOTTOM_CENTER });
    }
  };

  const captureFrame = async () => {
    try {
      if (webcamRef.current) {
        await faceMyDetect();
        const faceDetections = {
          ...detectionsObject,
          detection: detectionsObject.detection._box,
        };
        imageService.captureFrame(webcamRef, faceDetections);
      }
    } catch (err) {
      console.error("Error capturing frame:", err);
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const generateAgain = () => {
    try {
      imageService.generateAgain();
    } catch (err) {
      console.error("Error generating image:", err);
      toast.error(err.message, { position: toast.POSITION.BOTTOM_CENTER });
    }
  };

  const saveImage = () => {
    try {
      imageService.saveImage();
      imageService.deleteImage();
      setShowResultImage(false);
    } catch (err) {
      console.error("Error when saving image:", err);
      toast.error(err.message, { position: toast.POSITION.BOTTOM_CENTER });
    }
  };

  return (
    <div className="container text-center">
      <ToastContainer />
      <div className="row justify-content-center">
        <PreviewImage webcamRef={webcamRef} captureFrame={captureFrame} />
        {resultImage && showButtons && showResultImage && (
          <ResultImage
            resultImage={resultImage}
            showButtons={showButtons}
            generateAgain={generateAgain}
            saveImage={saveImage}
          />
        )}
      </div>
    </div>
  );
};

export default WebcamFrameTool;

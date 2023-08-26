import React, { useRef, useEffect, useState } from "react";
import ImageService from "./services/ImageService";

import "./App.css";

const imageService = new ImageService();

const App = () => {
  const webcamRef = useRef(null);
  const [resultImage, setResultImage] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
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
      }
    };

    imageService.socket.on("result", (dataUrl) => {
      setResultImage(dataUrl);
      setShowButtons(true);
    });

    startCamera();

    const handleBeforeUnload = () => imageService.deleteImage();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const captureFrame = () => imageService.captureFrame(webcamRef);
  const generateAgain = () => imageService.generateAgain();
  const saveImage = () => {
    imageService.saveImage();
    imageService.deleteImage();
  };

  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        <div className={`webcam col-6 ${resultImage && showButtons ? "" : ""}`}>
          <h2>Webcam Image Manipulation</h2>
          <video ref={webcamRef} autoPlay className="rounded w-100"></video>
          <button className="btn btn-primary mt-5 me-5" onClick={captureFrame}>
            Capture
          </button>
        </div>
        {resultImage && showButtons && (
          <div className="col-6 resultImageContainer">
            <img
              src={resultImage}
              alt="ResultImage"
              className="resultImage rounded"
            />
            <div className="mt-3">
              <button className="btn btn-success" onClick={generateAgain}>
                Generate Again
              </button>
              <button className="btn btn-info ms-2" onClick={saveImage}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

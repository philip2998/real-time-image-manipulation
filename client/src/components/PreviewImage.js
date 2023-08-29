import React from "react";

const PreviewImage = ({ webcamRef, captureFrame }) => {
  return (
    <div className="webcam col-6" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <h2>Webcam Image Manipulation</h2>
      <video ref={webcamRef} autoPlay className="rounded w-100"></video>
      <button className="btn btn-primary" onClick={captureFrame}>
        Capture
      </button>
    </div>
  );
};

export default PreviewImage;

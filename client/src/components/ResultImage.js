import React from "react";

const ResultImage = ({
  resultImage,
  showButtons,
  generateAgain,
  saveImage,
}) => {
  return (
    <div className="col-6 resultImageContainer">
      <img
        src={resultImage}
        alt="ResultImage"
        className="resultImage rounded"
      />
      {showButtons && (
        <div className="mt-3">
          <button className="btn btn-success" onClick={generateAgain}>
            Generate Again
          </button>
          <button className="btn btn-info ms-2" onClick={saveImage}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultImage;

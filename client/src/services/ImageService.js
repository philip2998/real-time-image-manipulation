import io from "socket.io-client";

class ImageService {
  constructor() {
    this.socket = io.connect("http://localhost:5000");
    this.isConnected = false;
    this.resultImage = "";
    this.showButtons = false;

    this.connect();
  }

  connect() {
    if (!this.isConnected) {
      this.socket.on("result", (dataUrl) => {
        this.resultImage = dataUrl;
        this.showButtons = true;
      });
      this.isConnected = true;
    }
  }

  captureFrame(webcamRef, detections) {
    const canvas = document.createElement("canvas");
    const { detection } = detections;
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");
    const capturedData = {
      imageData,
      detection,
    };

    this.socket.emit("capture-result", capturedData);
  }

  generateAgain() {
    this.socket.emit("generate-result");
  }

  saveImage() {
    if (this.resultImage) {
      const link = document.createElement("a");
      link.href = this.resultImage.data;
      link.download = "result.jpg";
      link.click();
    }
  }

  deleteImage() {
    this.socket.emit("deleteImage-result");
  }
}

export default ImageService;

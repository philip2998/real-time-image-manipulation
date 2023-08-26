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

  captureFrame(webcamRef) {
    const canvas = document.createElement("canvas");
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    this.socket.emit("capture", imageData);
  }

  generateAgain() {
    this.socket.emit("generate");
    this.clearImage();
  }

  saveImage() {
    if (this.resultImage) {
      const link = document.createElement("a");
      link.href = this.resultImage;
      link.download = "result.jpg";
      link.click();
    }
  }

  clearImage() {
    this.resultImage = "";
    this.showButtons = false;
  }

  deleteImage() {
    this.socket.emit("deleteImage");
    this.clearImage();
  }
}

export default ImageService;

import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";

class ImageController {
  constructor(socket) {
    this.socket = socket;
    this.images = [
      "images/galaxy.png",
      "images/glasses.png",
      "images/devilAngel.png",
    ];
    this.latestCapturedImageData = null;
  }

  async captureFrame(userImage) {
    try {
      const imageBuffer = this.extractImageBuffer(userImage);
      this.saveImageToFile(imageBuffer);

      const resultData = await this.processAndComposeImage(imageBuffer);
      this.socket.emit("result", resultData);
    } catch (err) {
      console.error("Error processing image:", err);
    }
  }

  async generateImage() {
    try {
      const resultData = await this.processAndComposeImage(
        this.latestCapturedImageData
      );
      this.socket.emit("result", resultData);
    } catch (err) {
      console.error("Error generating image:", err);
    }
  }

  async deleteImage() {
    try {
      const previousImagePath = `userImages/${this.socket.id}.jpeg`;
      if (fs.existsSync(previousImagePath) || !this.socket) {
        this.deleteImageFile(previousImagePath);
        this.socket.emit("deleteImage", previousImagePath);
      } else {
        console.log("No previous image found to delete.");
      }
    } catch (err) {
      console.error("Error deleting previous image:", err);
    }
  }

  extractImageBuffer(userImage) {
    const matches = userImage.match(/^data:.+\/(.+);base64,(.*)$/);
    const imageDataString = matches[2];
    return Buffer.from(imageDataString, "base64");
  }

  saveImageToFile(imageBuffer) {
    const imagePath = `userImages/${this.socket.id}.jpeg`;
    fs.writeFileSync(imagePath, imageBuffer);
    this.latestCapturedImageData = imageBuffer;
  }

  async processAndComposeImage(imageBuffer) {
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext("2d");

    if (imageBuffer) {
      const capturedImage = await loadImage(imageBuffer);
      ctx.drawImage(capturedImage, 0, 0, 400, 400);
    }

    const randomImageUrl =
      this.images[Math.floor(Math.random() * this.images.length)];
    const randomImage = await loadImage(randomImageUrl);
    ctx.drawImage(randomImage, 0, 0, 400, 200);

    return canvas.toDataURL("image/jpeg");
  }

  deleteImageFile(imagePath) {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
}

export default ImageController;

import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";

const maxCanvasWidth = 640;
const maxCanvasHeight = 480;
const images = [
  {
    url: "images/devilAngel.png",
    offsetX: (x) => x - 40,
    offsetY: (y) => y - 140,
    faceRatioWidth: (width) => width + 100,
    faceRatioHeight: (height) => height,
  },
  {
    url: "images/galaxy.png",
    offsetX: (x) => x - 40,
    offsetY: (y) => y - 140,
    faceRatioWidth: (width) => width + 100,
    faceRatioHeight: (height) => height,
  },
  {
    url: "images/glasses.png",
    offsetX: (x) => x + 5,
    offsetY: (y) => y,
    faceRatioWidth: (width) => width,
    faceRatioHeight: (width) => width / 2,
  },
];

class ImageController {
  constructor(userId) {
    this.userId = userId;
    this.latestCapturedDetection = null;
  }

  async captureFrame(capturedData) {
    try {
      const { imageData, detection } = capturedData;
      const imageBuffer = this.extractImageBuffer(imageData);
      this.saveImageData(imageBuffer, detection);

      const resultData = await this.processAndComposeImage(
        imageBuffer,
        detection
      );
      return resultData;
    } catch (err) {
      console.error("Error processing image:", err);
      throw new Error("Error while processing image.");
    }
  }

  async generateImage() {
    try {
      const imageData = await this.loadImageData();
      const resultData = await this.processAndComposeImage(
        imageData,
        this.latestCapturedDetection
      );
      return resultData;
    } catch (err) {
      console.error("Error generating image:", err);
      throw new Error("Error while generating image.");
    }
  }

  async deleteImage() {
    try {
      const previousImagePath = `userImages/${this.userId}.jpeg`;
      if (fs.existsSync(previousImagePath)) {
        await fs.promises.unlink(previousImagePath);
        const resultData = previousImagePath;
        return resultData;
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

  async saveImageData(imageBuffer, detection) {
    const imagePath = `userImages/${this.userId}.jpeg`;
    await fs.promises.writeFile(imagePath, imageBuffer);
    // Because each detection is less then 80 byte we can store in memory
    // and because image can be more then 5mb it is better to store it in file system
    this.latestCapturedDetection = detection;
  }

  async loadImageData() {
    const imagePath = `userImages/${this.userId}.jpeg`;
    const fileData = await fs.promises.readFile(imagePath);
    return fileData;
  }

  async processAndComposeImage(imageBuffer, detection) {
    const { _x, _y, _width, _height } = detection;
    const canvas = createCanvas(maxCanvasWidth, maxCanvasHeight);
    const ctx = canvas.getContext("2d");

    if (imageBuffer) {
      const capturedImage = await loadImage(imageBuffer);
      ctx.drawImage(capturedImage, 0, 0, maxCanvasWidth, maxCanvasHeight);
    }

    const randomImageUrl =
      images[Math.floor(Math.random() * images.length)].url;
    const randomImage = await loadImage(randomImageUrl);
    const { offsetX, offsetY, faceRatioWidth, faceRatioHeight } = images.find(
      (image) => image.url === randomImageUrl
    );
    // TODO: To get more accurate pictures, we need to make precise
    // and more complex calculations, which takes time
    const x = offsetX(_x);
    const y = offsetY(_y);
    const w = faceRatioWidth(_width);
    const h = faceRatioHeight(_width);
    ctx.drawImage(randomImage, x, y, w, h);
    return canvas.toDataURL("image/jpeg");
  }
}

export default ImageController;

import ImageController from "../controllers/ImageController.js";

function configureSocket(io) {
  io.on("connection", (socket) => {
    const imageController = new ImageController(socket);

    socket.on("capture", (imageData) => {
      imageController.captureFrame(imageData);
    });

    socket.on("generate", () => {
      imageController.generateImage();
    });

    socket.on("deleteImage", () => {
      imageController.deleteImage();
    });
  });
}

export default configureSocket;

import ImageController from "../controllers/ImageController.js";

function configureSocket(io) {
  io.on("connection", (socket) => {
    const imageController = new ImageController(socket.id);

    socket.on("capture-result", async (imageData) => {
      try {
        const res = await imageController.captureFrame(imageData);
        socket.emit("result", {
          isOk: true,
          data: res,
        });
      } catch (err) {
        socket.emit("result", {
          isOk: false,
          message: err.message,
        });
      }
    });

    socket.on("generate-result", async () => {
      try {
        const res = await imageController.generateImage();
        socket.emit("result", {
          isOk: true,
          data: res,
        });
      } catch (err) {
        socket.emit("result", {
          isOk: false,
          message: err.message,
        });
      }
    });

    socket.on("deleteImage-result", async () => {
      try {
        const res = await imageController.deleteImage();
        socket.emit("result", {
          isOk: true,
          data: res,
        });
      } catch (err) {
        socket.emit("result", {
          isOk: false,
          message: err.message,
        });
      }
    });
  });
}

export default configureSocket;

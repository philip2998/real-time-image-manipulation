import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import http from "http";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";

import configureSocket from "./route/index.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use(cors());
app.use(express.static(path.resolve("public")));
app.use("/images", express.static(path.resolve("images")));

configureSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

// init server
import cors from "cors";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

export const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Theia Brain</h1>");
});

export const server: any = createServer(app);

export const io: any = new Server(server, {
  cors: {
    origin: [
      "localhost:8080", // Remove * in production
      "thei.app",
      "ia.estate",
    ],
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e9, // 0.93 gigabyte
  // pingTimeout: 20,
});

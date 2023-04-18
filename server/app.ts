// init server
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import initRoutes from "./routes";
import cors from "cors";

export const app: express.Application = express();

initRoutes();

app.use(cors());
app.use(express.json());
app.use(bodyParser.raw({ type: "audio/mpeg", limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Theia Brain</h1>");
});

export const server: any = createServer(app);

export const io: any = new Server(server, {
  cors: {
    origin: [
      "*", // Remove * in production
      "thei.app",
      "ia.estate",
    ],
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e9, // 0.93 gigabyte
  pingTimeout: 20,
});

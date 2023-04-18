import fs from "fs";
import { app } from "../app";
import { socketId } from "../services/sockets";

export default function initRoutes() {
  app.post(`/audios/$${socketId}`, (req, res) => {
    const audioBuffer = req.body;
    fs.writeFileSync(`${Date.now()}.mp3`, audioBuffer);
    res.sendStatus(200);
  });
}

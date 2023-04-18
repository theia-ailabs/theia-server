import { Server, Socket } from "socket.io";
import { askChatGPT } from "../apis/openai";
import { genSpeech } from "../apis/play-ht";
import { getSpeech } from "../apis/humanVoices";
import { AudioBuffer } from "audiobuffer";

export let usersConnected: number = 0;

export const socketConnect = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    // Connection
    usersConnected++;
    socket.emit("nUsers", usersConnected);
    console.log(usersConnected, "users connected.");
    socket.emit("serverConnection", "Client connected to server succesfully");
    // Disconnection
    socket.on("disconnect", () => {
      usersConnected--;
      console.log(usersConnected, "users connected.");
      socket.emit("nUsers", usersConnected);
    });
    // Errors
    socket.on("error", (err: any) => {
      console.log("ERROR: Socket error:\n", err);
    });
    // Sockets
    searchUserSocket(socket);
    askTheiaSocket(socket);
  });
};

const searchUserSocket = (socket: Socket): void => {
  socket.on("username", (username: string) => {
    console.log(username);
    socket.emit("username", false);
  });
};

const askTheiaSocket = (socket: Socket): void => {
  socket.volatile.on("askTheia", async (question: string) => {
    if (question) {
      console.log(question);
      const response = await askChatGPT(question);
      const res = {
        text: response,
        audio: new AudioBuffer({ length: 0, sampleRate: 0 }),
      };
      socket.volatile.emit("theiaRes", res);
      res.audio = await getSpeech(res.text as string);
      socket.volatile.emit("theiaRes", res);
    } else {
      const msgErr = `❌ ERROR: Input msg undefined.`;
      socket.volatile.emit("theiaRes", msgErr);
      console.log("askTheiaSocket", msgErr);
    }
  });
};

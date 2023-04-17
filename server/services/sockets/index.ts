import { Server, Socket } from "socket.io";
import { askChatGPT } from "../apis/openai";
import { genSpeech } from "../apis/play-ht";

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
  socket.on("askTheia", async (question: string) => {
    if (question) {
      console.log(question);
      const response = await askChatGPT(question);
      console.log(response);
      const speech = await genSpeech(response as string, "alphonso", 1);
      const ret = {
        text: response,
        audio: speech.url,
        duration: speech.duration,
        size: speech.size,
      }
      socket.emit("theiaRes", ret);
    } else {
      const msgErr = `❌ ERROR: Input msg wrong.`;
      socket.emit("theiaRes", msgErr);
      console.log("askTheiaSocket", msgErr);
    }
  });
};

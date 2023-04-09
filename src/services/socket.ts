import { Server, Socket } from "socket.io";
import { OpenaiApi } from "./apis/openai";

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
    askTheiaSocket(socket);
  });
};

const askTheiaSocket = (socket: Socket): void => {
  const openai = new OpenaiApi();
  socket.on("theiaMessage", async (question: string) => {
    if (question.length > 22) {
      const response = await openai.askChatGPT(question);
      socket.emit("Theia", response);
    } else {
      const msgErr = `❌ ERROR: getUserFeed socket input is wrong. Check pubkey arg!`;
      socket.emit("Theia", msgErr);
      console.log("printLogs", msgErr);
    }
  });
};

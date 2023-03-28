import { Server, Socket } from "socket.io";
import userSocket from "./sockets/users.socket";
import messagesSocket from "./sockets/messages.socket";
import nftsSocket from "./sockets/nfts.socket";
import tokenSocket from "./sockets/token.socket";
import servicesSocket from "./sockets/services.socket";

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
  socket.on("getUserFeed", async (pubkey: string) => {
    if (pubkey.length > 22) {
      socket.emit("getUserFeedRes", await getUserFeed(pubkey));
    } else {
      const msgErr = `❌ ERROR: getUserFeed socket input is wrong. Check pubkey arg!`;
      socket.emit("getUserFeedRes", msgErr);
      console.log("printLogs", msgErr);
    }
  });
};

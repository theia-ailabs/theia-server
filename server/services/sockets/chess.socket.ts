import { Socket } from "socket.io";
import { getLichessUser } from "../chess/auth";

export const lichessAccountSocket = (socket: Socket): void => {
  socket.on("lichessAccount", (token: string) => {
    socket.emit("lichessAccountRes", await getLichessUser(token));
    });
  });
};

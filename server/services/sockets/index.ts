import { Server, Socket } from "socket.io";
import { askChatGPT } from "../apis/openai";
import { getSpeechUrl } from "../apis/humanVoices";
import { AskTheiaRet } from "../../interfaces";

export let usersConnected = 0;
export let socketId = "";

export const socketConnect = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    // Connection
    usersConnected++;
    socketId = socket.id;
    socket.emit("nUsers", usersConnected);
    console.log(usersConnected, "users connected.");
    socket.emit("serverConnection", "Connected to server succesfully!");
    // Disconnection
    socket.on("disconnect", () => {
      usersConnected--;
      console.log(usersConnected, "users connected.");
      socket.emit("nUsers", usersConnected);
    });
    // Errors
    socket.on("error", (err: Error) => {
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
  let messageId = -1;
  socket.volatile.on(
    "askTheia",
    async (
      question: string,
      _voice = "denis",
      _speed = 1,
      _userVoice = "larry"
    ) => {
      if (question) {
        messageId++;
        // 1 Emit thinking
        const res: AskTheiaRet = {
          question: question,
          audio: "",
          answer: "Thinking... ",
          words: 0,
          speech: "",
          duration: 0,
          size: 0,
          timestamp: Date.now(),
          messageId: messageId + "_" + socket.id + "_" + Date.now(),
          computed_in: 0,
        };
        socket.volatile.emit("theiaRes", res, messageId); // thinking
        // 2 Emit user audio
        const audio = await getSpeechUrl(
          res.question + "  ...  ",
          _userVoice,
          _speed
        );
        res.audio = audio.url;
        socket.volatile.emit("theiaRes", res, messageId); // user audio
        // 3 Emit Theia answer (text)
        res.answer = (await askChatGPT(question)) as string;
        res.words = res.answer.split(" ").length;
        socket.volatile.emit("theiaRes", res, messageId); // text
        // 4 Emit Theia speech (audio)
        const speech = await getSpeechUrl(
          res.answer + "  ...  ",
          _voice,
          _speed
        );
        res.audio = speech.url;
        res.duration = speech.duration;
        res.size = speech.size;
        socket.volatile.emit("theiaRes", res, messageId); // audio
      } else {
        const msgErr = `❌ ERROR: Input msg undefined.`;
        socket.volatile.emit("theiaRes", msgErr); // Err
        console.log("askTheiaSocket", msgErr);
      }
    }
  );
};

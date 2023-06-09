import { Socket } from "socket.io";
import { askChatGPT } from "../apis/openai";
import { getSpeechUrl } from "../apis/humanVoices";
import { AskTheiaRet } from "../../interfaces";

export const askTheiaSocket = (socket: Socket): void => {
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
        res.speech = speech.url;
        res.duration = speech.duration;
        res.size = speech.size;
        socket.volatile.emit("theiaRes", res, messageId); // audio
        console.log(res);
        messageId--;
      } else {
        const msgErr = `❌ ERROR: Input msg undefined.`;
        socket.volatile.emit("theiaRes", msgErr); // Err
        console.log("askTheiaSocket", msgErr);
      }
    }
  );
};

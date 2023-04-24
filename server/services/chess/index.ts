import newGame from "./play";
import getLichessUser from "./auth";
import { LICHESS_KEY } from "../../config";

const gameID = newGame(LICHESS_KEY);

console.log("gameID: ", gameID);

const userInfo = getLichessUser(LICHESS_KEY);

console.log("userInfo: ", userInfo);

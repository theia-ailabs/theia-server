import { LichessChessPlayer } from "./play";
import { LICHESS_KEY } from "../../config";

const chess = new LichessChessPlayer(LICHESS_KEY);

chess.play();

import { LichessClient } from "node-lichess";
import { Chess } from "chess.js";

export class LichessChessPlayer {
  private client = LichessClient;
  private chess: Chess;

  constructor(token: string) {
    this.client = new LichessClient({ token });
    this.chess = new Chess();
  }

  async play() {
    while (!this.chess.isGameOver()) {
      const { moves, game } = await this.client.streamGameState();
      console.log(moves);
      console.log(game);
      if (moves) {
        this.chess.move(moves[moves.length - 1]);
        console.log(this.chess.board());
      }
    }
  }
}

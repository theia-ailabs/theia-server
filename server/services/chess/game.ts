import { Chessground } from "./chessground";
import { Api } from "chessground/api";
import { Config } from "chessground/config";
import { Chess } from "chess.js";
import { LichessApi } from "../../interfaces";
import { Color, Key } from "../../interfaces/chess";

require = require("esm")(module);

export class LichessApiImpl implements LichessApi {
  private readonly baseUrl = "https://lichess.org/api/";

  async createGame(token: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}board/seek`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "rated=false&variant=standard",
    });

    const data = await response.json();
    return data.challenge.id;
  }

  async makeMove(gameId: string, move: string, token: string): Promise<void> {
    await fetch(`${this.baseUrl}board/game/${gameId}/move/${move}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export class ChessBoard {
  private chessground: Api;
  private chess: Chess | any;
  private lichess: LichessApi;
  private gameId: string | undefined;
  private userColor: Color;

  constructor(container: HTMLElement, lichessToken: string) {
    this.chess = new Chess();
    this.lichess = new LichessApiImpl();
    this.userColor = "white";

    const config: Config = {
      fen: this.chess.fen(),
      movable: {
        free: false,
        color: this.userColor,
        dests: this.calcDests() as any,
        events: {
          after: (orig: any, dest: any) => {
            this.onMove(orig, dest);
          },
        },
      },
      draggable: {
        showGhost: true,
      },
    };

    this.chessground = Chessground(container, config);
    this.joinGame(lichessToken);
  }

  private async joinGame(lichessToken: string): Promise<void> {
    this.gameId = await this.lichess.createGame(lichessToken);
  }

  private calcDests(): Map<string, string[]> {
    const dests = new Map();
    this.chess.SQUARES.forEach((square: object) => {
      const moves = this.chess.moves({ square, verbose: true });
      if (moves.length) {
        dests.set(
          square,
          moves.map((move: any) => move.to)
        );
      }
    });
    return dests;
  }

  private async onMove(orig: Key, dest: Key): Promise<void> {
    if (!this.gameId) return;
    const move = this.chess.move({ from: orig, to: dest });
    if (move) {
      this.chessground.set({
        fen: this.chess.fen(),
        lastMove: [orig, dest],
        turnColor: this.chess.turn() === "w" ? "white" : "black",
        movable: { dests: this.calcDests() as any },
      });
      await this.lichess.makeMove(
        this.gameId,
        move.san,
        this.chessground.state.movable.color as any
      );
      this.updateGameState();
    }
  }

  private async updateGameState(): Promise<void> {
    if (this.chess.in_checkmate()) {
      alert("Scacco matto!");
    } else if (this.chess.in_draw()) {
      alert("Patta!");
    } else if (this.chess.in_stalemate()) {
      alert("Stallo!");
    } else if (this.chess.in_threefold_repetition()) {
      alert("Ripetizione tre volte!");
    } else if (this.chess.insufficient_material()) {
      alert("Materiale insufficiente!");
    }
  }
}

export function initLichessBoard(token: string): ChessBoard | boolean {
  const container = document.getElementById("chessboard");
  const lichessToken = token;
  if (container) {
    return new ChessBoard(container, lichessToken);
  }
  return false;
}

initLichessBoard("lip_95FGJRUVzQJL0sUsOSoi");

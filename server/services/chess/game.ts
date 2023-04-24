// import delle librerie necessarie
import { Chessground } from 'chessground';
import { Api, Board, Color } from 'chessground/api';
import { Config } from 'chessground/config';
import { Chess } from 'chess.js';

// Creazione dell'interfaccia per l'API di Lichess
interface LichessApi {
  createGame: (token: string) => Promise<string>;
  makeMove: (gameId: string, move: string, token: string) => Promise<void>;
}

// Implementazione dell'API di Lichess
class LichessApiImpl implements LichessApi {
  private readonly baseUrl = 'https://lichess.org/api/';

  async createGame(token: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}board/seek`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'rated=false&variant=standard',
    });

    const data = await response.json();
    return data.challenge.id;
  }

  async makeMove(gameId: string, move: string, token: string): Promise<void> {
    await fetch(`${this.baseUrl}board/game/${gameId}/move/${move}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Creazione della classe Scacchiera
class Scacchiera {
  private chessground: Api;
  private chess: Chess;
  private lichess: LichessApi;
  private gameId: string | undefined;
  private userColor: Color;

  constructor(container: HTMLElement, lichessToken: string) {
    this.chess = new Chess();
    this.lichess = new LichessApiImpl();
    this.userColor = 'white';

    const config: Config = {
      fen: this.chess.fen(),
      movable: {
        free: false,
        color: this.userColor,
        dests: this.calcDests(),
        events: {
          after: (orig : any, dest : any) => {
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
    let square : any ; 
    const dests = new Map();
    this.chess.SQUARES.forEach(square  => {
      const moves = this.chess.moves({ square, verbose: true });
      if (moves.length) {
        dests.set(square, moves.map(move => move.to));
      }
    });
    return dests;
  }

  private async onMove(orig: Board.Key, dest: Board.Key): Promise<void> {
    if (!this.gameId) return;

    const move = this.chess.move({ from: orig, to: dest });

    if (move) {
      this.chessground.set({ fen: this.chess.fen(), lastMove: [orig, dest], turnColor: this.chess.turn() === 'w' ? 'white' : 'black', movable: {
dests: this.calcDests(),
},
});

await this.lichess.makeMove(this.gameId, move.san, this.chessground.state.movable.color);
this.updateGameState();

}

private async updateGameState(): Promise<void> {
if (this.chess.in_checkmate()) {
alert('Scacco matto!');
} else if (this.chess.in_draw()) {
alert('Patta!');
} else if (this.chess.in_stalemate()) {
alert('Stallo!');
} else if (this.chess.in_threefold_repetition()) {
alert('Ripetizione tre volte!');
} else if (this.chess.insufficient_material()) {
alert('Materiale insufficiente!');
}
}
}

// Funzione per inizializzare la scacchiera
function initChessboard(): void {
const container = document.getElementById('chessboard');
const lichessToken = '<your_lichess_api_token>';

if (container) {
new Scacchiera(container, lichessToken);
}
}

/*
// Chiamata alla funzione di inizializzazione quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', initChessboard);
npm install chessground
npm install chess.js


"""Infine, aggiungi un elemento HTML con l'ID 'chessboard' nella tua pagina web per visualizzare la scacchiera:"""


 """ html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Scacchiera</title>
  <link rel="stylesheet" href="node_modules/chessground/assets/chessground.css">
</head>
<body>
  <div id="chessboard" style="width: 400px; height: 400px;"></div>
  <script src="your_compiled_script.js"></script>
</body>
</html> """


*/
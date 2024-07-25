type Player = "X" | "O" | null
type Board = Player[][]

interface GameHistory {
  board: Board
  move: string
  player: Player
}

class TicTacToe {
  private board: Board
  private moves: string[]
  private activePlayer: Player
  private winningPlayer: Player
  private history: GameHistory[]

  constructor() {
    this.board = Array.from({ length: 3 }, () => Array(3).fill(null))
    this.activePlayer = "X"
    this.winningPlayer = null
    this.moves = []
    this.history = []
  }

  public isValidMove(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < 3 &&
      col >= 0 &&
      col < 3 &&
      this.board[row][col] === null &&
      this.winningPlayer === null
    )
  }

  private checkVictory(): Player {
    const winPatterns = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern

      if (
        this.board[a[0]][a[1]] &&
        this.board[a[0]][a[1]] === this.board[b[0]][b[1]] &&
        this.board[a[0]][a[1]] === this.board[c[0]][c[1]]
      ) {
        return this.board[a[0]][a[1]]
      }
    }

    return null
  }

  private isDraw(): boolean {
    return (
      this.board.flat().every((cell) => cell !== null) &&
      this.winningPlayer === null
    )
  }

  // we might not need to change the features here
  public makeMove(row: number, col: number): boolean {
    if (!this.isValidMove(row, col)) {
      return false
    }

    this.board[row][col] = this.activePlayer

    this.winningPlayer = this.checkVictory()

    this.moves.push(`${row},${col}`)

    this.history.push({
      board: this.getBoard(),
      move: `${row},${col}`,
      player: this.activePlayer,
    })

    if (!this.winningPlayer && !this.isDraw()) {
      this.activePlayer = this.activePlayer === "X" ? "O" : "X"
    }

    return true
  }

  public getMoves(): string[] {
    return this.moves
  }

  public getwinningPlayer(): Player {
    return this.winningPlayer
  }

  public isGameOver(): boolean {
    return this.winningPlayer !== null || this.isDraw()
  }

  public getBoard(): Board {
    return this.board.map((row) => [...row])
  }

  public getActivePlayer(): Player {
    return this.activePlayer
  }

  public isDrawGame(): boolean {
    return this.isDraw()
  }

  public getHistory(): GameHistory[] {
    return this.history
  }

  public undoLastMove(): boolean {
    if (this.history.length === 0) {
      return false
    }

    this.history.pop()
    this.moves.pop()

    if (this.history.length === 0) {
      this.board = Array.from({ length: 3 }, () => Array(3).fill(null))
      this.activePlayer = "X"
    } else {
      const lastState = this.history[this.history.length - 1]
      this.board = lastState.board
      this.activePlayer = lastState.player === "X" ? "O" : "X"
    }

    this.winningPlayer = null
    return true
  }

  public resetGame(): void {
    this.board = Array.from({ length: 3 }, () => Array(3).fill(null))
    this.activePlayer = "X"
    this.winningPlayer = null
    this.moves = []
    this.history = []
  }
}

export default TicTacToe

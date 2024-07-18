type Player = "X" | "O" | null

class TicTacToe {
  private board: Player[][]
  private moves: string[]
  private currentPlayer: Player
  private winningPlayer: Player

  constructor() {
    this.board = Array.from({ length: 3 }, () => Array(3).fill(null))
    this.currentPlayer = "X"
    this.winningPlayer = null
    this.moves = []
  }

  isValidMove(row: number, col: number): boolean {
    return this.board[row][col] === null && this.winningPlayer === null
  }

  private checkWinner(): Player {
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0] &&
        this.board[i][0] === this.board[i][1] &&
        this.board[i][1] === this.board[i][2]
      ) {
        return this.board[i][0]
      }
      if (
        this.board[0][i] &&
        this.board[0][i] === this.board[1][i] &&
        this.board[1][i] === this.board[2][i]
      ) {
        return this.board[0][i]
      }
    }

    if (
      this.board[0][0] &&
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      return this.board[0][0]
    }
    if (
      this.board[0][2] &&
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      return this.board[0][2]
    }

    return null
  }

  private isDraw(): boolean {
    return (
      this.board.flat().every((cell) => cell !== null) &&
      this.winningPlayer === null
    )
  }

  public makeMove(row: number, col: number): boolean {
    if (!this.isValidMove(row, col)) {
      return false
    }

    this.board[row][col] = this.currentPlayer
    this.winningPlayer = this.checkWinner()

    if (!this.winningPlayer) {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"
    }

    this.moves.push(`${row},${col}`)
    return true
  }

  public getMoves(): string[] {
    return this.moves
  }

  public getWinner(): Player {
    return this.winningPlayer
  }

  public isGameOver(): boolean {
    return this.winningPlayer !== null || this.isDraw()
  }

  public getBoard(): Player[][] {
    return this.board
  }

  public getCurrentPlayer(): Player {
    return this.currentPlayer
  }

  public isDrawGame(): boolean {
    return this.isDraw()
  }
}

export default TicTacToe

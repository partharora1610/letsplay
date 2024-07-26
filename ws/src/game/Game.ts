import TicTacToe from "./TicTacToe"
import { randomUUID } from "crypto"
import User from "utils/User"
import { SocketManager } from "../sockets/SocketManager"
import prisma from "../db/index"

const GAME_STARTED = "game_started"
const MAKE_MOVE = "make_move"
type GAME_STATUS = "IN_PROGRESS" | "COMPLETED" | "ABANDONED" | "TIME_UP"
type GAME_RESULT = "X_WINS" | "O_WINS" | "DRAW"

class Game {
  public gameId: string
  public player1UserId: string
  public player2UserId: string | null
  public game: TicTacToe

  constructor(player1: string, player2: string | null) {
    this.player1UserId = player1
    this.player2UserId = player2
    this.game = new TicTacToe()
    this.gameId = randomUUID()
  }

  makeMove(player: User, move: string) {
    const row = Math.floor(parseInt(move) / 3)
    const col = parseInt(move) % 3

    if (this.game.isValidMove(row, col)) {
      this.game.makeMove(row, col)
    }

    SocketManager.getInstance().broadcast(
      this.gameId,
      JSON.stringify({
        type: MAKE_MOVE,
        payload: {
          move: move,
          player: player.userId,
        },
      })
    )

    this.saveMoveInDB(row, col)

    if (this.game.getwinningPlayer() !== null) {
      const result = this.game.getwinningPlayer() === "X" ? "X_WINS" : "O_WINS"
      this.endGame("COMPLETED", result)
    }

    if (this.game.isDrawGame()) {
      this.endGame("COMPLETED", "DRAW")
    }
  }

  async updateSecondPlayer(userId: string) {
    this.player2UserId = userId

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: [this.player1UserId, this.player2UserId ?? ""],
        },
      },
    })

    await this.createGameInDB()

    SocketManager.getInstance().broadcast(
      this.gameId,
      JSON.stringify({
        type: GAME_STARTED,
        payload: {
          gameId: this.gameId,
          XPlayer: {
            name: users.find((user) => user.id === this.player1UserId)?.name,
            id: this.player1UserId,
          },
          OPlayer: {
            name: users.find((user) => user.id === this.player2UserId)?.name,
            id: this.player2UserId,
          },
          moves: [],
        },
      })
    )
  }

  async createGameInDB() {
    console.log("Creating game in DB")
    console.log(this.gameId)

    const game = await prisma.game.create({
      data: {
        id: this.gameId,
        playerX: {
          connect: {
            id: this.player1UserId,
          },
        },
        playerO: {
          connect: {
            id: this.player2UserId,
          },
        },
      },
    })
  }

  async saveMoveInDB(row: number, col: number) {
    const move = `${row},${col}`

    await prisma.move.create({
      data: {
        game: {
          connect: {
            id: this.gameId,
          },
        },
        move,
      },
    })
  }

  async endGame(status: GAME_STATUS, result: GAME_RESULT) {
    await prisma.game.update({
      where: {
        id: this.gameId,
      },
      data: {
        status,
        result,
      },
    })

    SocketManager.getInstance().broadcast(
      this.gameId,
      JSON.stringify({
        type: "game_over",
        payload: {
          status,
          result,
        },
      })
    )
  }
}

export default Game

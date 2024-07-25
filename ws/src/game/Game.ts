import TicTacToe from "./TicTacToe"
import { randomUUID } from "crypto"
import User from "utils/User"
import { SocketManager } from "../sockets/SocketManager"
import prisma from "db"

class Game {
  public gameId: string
  public player1UserId: string
  public player2UserId: string | null
  public board: TicTacToe

  constructor(player1: string, player2: string | null, gameId?: string) {
    this.player1UserId = player1
    this.player2UserId = player2
    this.board = new TicTacToe()
    this.gameId = gameId ?? randomUUID()
  }

  makeMove(player: User, move: string) {
    console.log("Want to make move")
  }

  async updateSecondPlayer(userId: string) {
    this.player2UserId = userId

    try {
      await this.createGameInDB()
    } catch (e) {
      return
    }

    SocketManager.getInstance().broadcast(
      this.gameId,
      JSON.stringify({
        type: "game_started",
        payload: {
          gameId: this.gameId,
          XPlayer: "",
          OPlayer: "",
          moves: [],
        },
      })
    )
  }

  async createGameInDB() {
    const game = await prisma.game.create({
      data: {
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

    this.gameId = game.id
  }

  async saveMoveInDB(move: string) {
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

  async endGame(status: string, result: string) {}
}

export default Game

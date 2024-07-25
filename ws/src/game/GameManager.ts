import { WebSocket } from "ws"
import Game from "./Game"
import User from "utils/User"
import { GAME_ADDED, INIT_GAME, MAKE_MOVE } from "../ws-types/index"
import { SocketManager } from "../sockets/SocketManager"

class GameManager {
  games: Game[]
  private static instance: GameManager
  public pendingGameId: string | null
  public users: User[]

  private constructor() {
    this.games = []
    this.pendingGameId = null
    this.users = []
  }

  static getInstance() {
    if (GameManager.instance) {
      return GameManager.instance
    }

    GameManager.instance = new GameManager()
    return GameManager.instance
  }

  addUser(user: User) {
    this.users.push(user)
    this.addHandler(user)
  }

  removeUser(socket: WebSocket) {
    const user = this.users.find((user) => user.socket === socket)

    if (!user) {
      console.error("User not found?")
      return
    }

    this.users = this.users.filter((user) => user.socket !== socket)

    SocketManager.getInstance().removeUser(user)
  }

  private removeGame(gameId: string) {
    this.games = this.games.filter((game) => game.gameId !== gameId)
  }

  private addHandler(user: User) {
    const socket = user.socket

    if (socket == null) return

    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString())
      console.log(message)

      if (message.type == INIT_GAME) {
        if (this.pendingGameId) {
          const game = this.games.find((g) => g.gameId === this.pendingGameId)

          if (!game) {
            console.error("Game not found")
            return
          }

          if (user.userId == game.player1UserId) {
            SocketManager.getInstance().broadcast(
              game.gameId,
              JSON.stringify({
                type: "game_alert",
                payload: {
                  message: "Trying to Connect with yourself?",
                },
              })
            )
            return
          }

          SocketManager.getInstance().addUser(user, game.gameId)

          await game?.updateSecondPlayer(user.userId)
          this.pendingGameId = null
        } else {
          const game = new Game(user.userId, null)
          this.games.push(game)
          this.pendingGameId = game.gameId

          SocketManager.getInstance().addUser(user, game.gameId)

          SocketManager.getInstance().broadcast(
            game.gameId,
            JSON.stringify({
              type: GAME_ADDED,
            })
          )
        }
      } else if (message.type == MAKE_MOVE) {
        console.log("Making Move")
        console.log(this.games)
        const game = this.games.find((g) => g.gameId === message.payload.gameId)

        if (!game) {
          console.log("Game not found")
          return
        }

        game.makeMove(user, message.payload.move)

        if (game.game.isGameOver()) {
          this.removeGame(game.gameId)
        }
      }
    })
  }
}

export const gameManager = GameManager.getInstance()

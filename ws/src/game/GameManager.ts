import { WebSocket } from "ws"
import Game from "./Game"
import User from "utils/User"
import { INIT_GAME } from "../ws-types/index"
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

  private addHandler(user: User) {
    const socket = user.socket

    if (socket == null) return

    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString())
      console.log(message)

      if (message.type == INIT_GAME) {
        if (this.pendingGameId) {
          // pending game in the server exist...
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

          // adding the second user to the same room...
          SocketManager.getInstance().addUser(user, game.gameId)

          // updating the second player in the Game and broadcasting the message to everyone...
          await game?.updateSecondPlayer(user.userId)
          this.pendingGameId = null
        } else {
          // creating new game with one user as of now
          const game = new Game(user.userId, null)
          this.games.push(game)
          this.pendingGameId = game.gameId

          SocketManager.getInstance().addUser(user, game.gameId)

          // This will tell th client that we are waiting for the new user
          SocketManager.getInstance().broadcast(
            game.gameId,
            JSON.stringify({
              type: "game_added",
            })
          )
        }
      }
    })
  }
}

export const gameManager = GameManager.getInstance()

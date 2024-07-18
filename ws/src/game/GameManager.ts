import { WebSocket } from "ws"
import Game from "./Game"

class GameManager {
  games: Game[]
  private static instance: GameManager
  private pendingUser: WebSocket | null
  private users: WebSocket[]

  private constructor() {
    this.games = []
    this.pendingUser = null
    this.users = []
  }

  static getInstance() {
    if (GameManager.instance) {
      return GameManager.instance
    }

    GameManager.instance = new GameManager()
    return GameManager.instance
  }

  addUser(user: WebSocket) {
    this.users.push(user)
    this.addHandler(user)
  }

  removeUser(user: WebSocket) {
    this.users = this.users.filter((u) => u !== user)
  }

  private addHandler(socket: WebSocket) {
    if (socket == null) return

    socket.on("message", (data) => {
      const message = JSON.parse(data.toString())

      switch (message.type) {
        case "init_game":
          if (this.pendingUser) {
            const game = new Game(this.pendingUser, socket)
            this.games.push(game)
            this.pendingUser = null
          } else {
            this.pendingUser = socket
          }
          break

        case "make_move":
          const { move } = message

          const game = this.games.find(
            (g) => g.player1 === socket || g.player2 === socket
          )

          // if game exist, we make the move...
          if (game) {
            game.makeMove(socket, move)
          }

          break

        case "leave_game":
          break

        default:
          break
      }
    })
  }
}

export const gameManager = GameManager.getInstance()

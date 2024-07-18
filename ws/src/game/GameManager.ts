import { WebSocket } from "ws"
import Game from "./Game"
import User from "utils/User"

class GameManager {
  games: Game[]
  private static instance: GameManager
  private pendingUser: User | null
  private users: User[]

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

    // updating the users
    this.users = this.users.filter((user) => user.socket !== socket)
    // Manage the same in the socketmanager Class
  }

  private addHandler(user: User) {
    const socket = user.socket

    if (socket == null) return

    socket.on("message", (data) => {
      const message = JSON.parse(data.toString())

      switch (message.type) {
        case "init_game":
          if (this.pendingUser) {
            const game = new Game(this.pendingUser, user)
            this.games.push(game)
            this.pendingUser = null
          } else {
            this.pendingUser = user
          }
          break

        case "make_move":
          const { move } = message

          // This logic is faulty
          const game = this.games.find(
            (g) => g.player1 === user || g.player2 === user
          )

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

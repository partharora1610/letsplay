import { randomUUID } from "crypto"
import { WebSocket } from "ws"

class User {
  public socket: WebSocket
  public id: string
  public userId: string

  constructor(socket: WebSocket, userId: string) {
    this.socket = socket
    this.userId = userId
    this.id = randomUUID()
  }
}

export default User

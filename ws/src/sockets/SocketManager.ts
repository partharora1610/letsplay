import User from "utils/User"

export class SocketManager {
  private static instance: SocketManager
  public interestedSockets: Map<string, User[]>
  public userRoomMappping: Map<string, string>

  private constructor() {
    this.interestedSockets = new Map<string, User[]>()
    this.userRoomMappping = new Map<string, string>()
  }

  static getInstance() {
    if (this.instance) {
      return this.instance
    }

    this.instance = new SocketManager()
    return this.instance
  }

  addUser(user: User, roomId: string) {
    this.interestedSockets.set(roomId, [
      ...(this.interestedSockets.get(roomId) || []),
      user,
    ])

    this.userRoomMappping.set(user.userId, roomId)

    // debug this
    console.log("User added")
    console.log("User room mapping", this.userRoomMappping)
    console.log("Interested sockets", this.interestedSockets)
  }

  broadcast(roomId: string, message: string) {
    const users = this.interestedSockets.get(roomId)

    console.log("Broadcasting to room", roomId)
    console.log("Users in room", users)

    if (!users) {
      console.error("No users in room?")
      return
    }

    users.forEach((user) => {
      user.socket.send(message)
    })
  }

  removeUser(user: User) {
    const roomId = this.userRoomMappping.get(user.userId)
    if (!roomId) {
      console.error("User was not interested in any room?")
      return
    }
    const room = this.interestedSockets.get(roomId) || []
    const remainingUsers = room.filter((u) => u.userId !== user.userId)
    this.interestedSockets.set(roomId, remainingUsers)

    if (this.interestedSockets.get(roomId)?.length === 0) {
      this.interestedSockets.delete(roomId)
    }

    this.userRoomMappping.delete(user.userId)
  }
}

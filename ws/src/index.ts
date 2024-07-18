import { gameManager } from "./game/GameManager"
import { WebSocketServer } from "ws"
const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", async function connection(ws) {
  console.log("connecting the user")

  ws.on("error", () => {})

  gameManager.addUser(ws)

  ws.on("close", () => {
    console.log("closing connection")
    gameManager.removeUser(ws)
  })
})

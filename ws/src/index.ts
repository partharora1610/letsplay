import { gameManager } from "./game/GameManager"
import { WebSocketServer } from "ws"
import url from "url"
import User from "utils/User"

const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", async function connection(ws) {
  //@ts-ignore
  const token: string = url.parse(req.url, true).query.token
  gameManager.addUser(new User(ws, token))

  ws.on("close", () => {
    console.log("closing connection")
    gameManager.removeUser(ws)
  })
})

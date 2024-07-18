import { useEffect, useState } from "react"

const WS_URL = "ws://localhost:8080"

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const token = "" // sending token along with the connection request
    const ws = new WebSocket(`${WS_URL}?token=${token}`)

    ws.onopen = () => {
      setSocket(ws)
    }

    ws.onclose = () => {
      setSocket(null)
    }

    return () => {
      ws.close()
    }
  }, [])

  return socket
}

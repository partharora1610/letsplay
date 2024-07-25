import useAuthStore from "@/zustand/user.store"
import { use, useEffect, useState } from "react"

const WS_URL = "ws://localhost:8080"

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    const token = user?.id // sending token along with the connection request
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

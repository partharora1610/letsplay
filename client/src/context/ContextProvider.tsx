import React from "react"
import { WebSocketProvider } from "./SocketContext"

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <WebSocketProvider>{children}</WebSocketProvider>
}

export default ContextProvider

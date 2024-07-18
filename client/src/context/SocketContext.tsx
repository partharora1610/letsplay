"use client"

import { useSocket } from "@/hooks/useSocket"
import React, { createContext, useContext, ReactNode } from "react"

type WebSocketContextType = WebSocket | null

const WebSocketContext = createContext<WebSocketContextType>(null)

export const useWebSocket = () => {
  return useContext(WebSocketContext)
}

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocket()

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  )
}

"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWebSocket } from "@/context/SocketContext"
import { MenuSquare } from "lucide-react"

const ConnectingCard: React.FC = () => {
  const socket = useWebSocket()
  const router = useRouter()

  useEffect(() => {
    if (!socket) return

    socket.send(
      JSON.stringify({
        type: "init_game",
      })
    )
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.onmessage = function (event) {
      const message = JSON.parse(event.data)
      console.log(message)
    }
  }, [socket])

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Connecting you to a player
        </h2>
        <div className="flex justify-center">
          <div className="inline-flex space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
        <p className="text-gray-600 text-center mt-4">
          Please wait while we find a match for you.
        </p>
      </div>
    </div>
  )
}

export default ConnectingCard

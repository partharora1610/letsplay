"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useWebSocket } from "@/context/SocketContext"
import useGameStore from "@/zustand/game.store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const GAME_START = "game_start"
const GAME_OVER = "game_over"
const JOIN_GAME = "join_game"
const MAKE_MOVE = "make_move"
const GAME_STATE = "game_state"
const INIT_GAME = "init_game"

// type BoardCell = null | "X" | "O"

// interface Metadata {
//   XPlayer: { id: string; name: string }
//   OPlayer: { id: string; name: string }
// }

const Page = () => {
  const socket = useWebSocket()
  const { game, board, gameMetadata } = useGameStore()
  const router = useRouter()
  const { id } = useParams()

  // setting the onmessages here
  // useEffect(() => {
  //   if (!socket) {
  //     return
  //   }

  //   socket.onmessage = function (event) {
  //     const message = JSON.parse(event.data)
  //     console.log(message)

  //     switch (message.type) {
  //       case GAME_START:
  //         // setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)))
  //         updateGameState()
  //         router.push(`/game/${message.payload.gameId}`)
  //         break

  //       case GAME_STATE:
  //         updateGameState()

  //         break

  //       case MAKE_MOVE:
  //         updateGameState()
  //         break

  //       case GAME_OVER:
  //         updateGameState()
  //         // setGameOver(true)
  //         const reason = message.payload.type == "draw" ? "draw" : "winner"

  //         if (reason == "draw") {
  //           // setDraw(true)
  //         }

  //         if (reason == "winner") {
  //           // setWinner(message.payload.data)
  //         }

  //         break

  //       default:
  //         break
  //     }
  //   }
  // }, [socket, router])

  return (
    <div>
      <div className=" min-h-screen text-white">
        <GameMetadata />
        {JSON.stringify(gameMetadata)}
        <br />

        {JSON.stringify(board)}
        {game.isGameOver() && <p>The game is over</p>}
        {game.isDrawGame() && <p>There is a draw</p>}
        {game.getWinningPlayer() && <p>There is a winner</p>}
        <p className="text-xl mb-8">{id}</p>
        <div className="flex flex-col items-center justify-center mt-40">
          <GameBoard />
        </div>
      </div>
    </div>
  )
}

const GameMetadata: React.FC = () => {
  const { gameMetadata } = useGameStore()

  return (
    <div>
      <div className="bg-gray-800 m-6 px-4 py-4 rounded-md">
        <div className="flex justify-between">
          <MetadataUser />
          <MetadataUser />
        </div>
      </div>
    </div>
  )
}

const MetadataUser: React.FC = () => {
  // consider the self user and the current user will always will be on the right will highlighed
  return (
    <div>
      <div className="flex gap-2 items-center">
        <div>
          <p className="text-white text-lg">Player X</p>
          <p className="text-white text-sm">{"username"}</p>
        </div>
        <div className={`rounded-md border-4 border-blue-400 p-1`}>
          <Avatar className="rounded-md w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

const GameBoard: React.FC = () => {
  const { board, updateGameState, game } = useGameStore()
  const socket = useWebSocket()

  const handleClick = (index: number) => {
    console.log(index)
    const row = Math.floor(index / 3)
    const col = index % 3

    socket?.send(
      JSON.stringify({
        type: MAKE_MOVE,
        payload: {
          move: index,
        },
      })
    )

    game.makeMove(Math.floor(index / 3), index % 3)
    updateGameState()
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {board.flat().map((value, index) => (
        <button
          key={index}
          className={`w-24 h-24 flex items-center justify-center text-3xl font-bold bg-white border-2 border-gray-300
      ${value === "X" ? "text-blue-500" : value === "O" ? "text-red-500" : ""}
      `}
          onClick={() => handleClick(index)}
          disabled={value !== null}
        >
          {JSON.stringify(value)}
        </button>
      ))}
    </div>
  )
}

export default Page

/**
 * 
 * 
 * 
        <p className="text-2xl mb-4">Game Page</p>
        {JSON.stringify(gameMetadata)}
        <br />

        {JSON.stringify(board)}
        {game.isGameOver() && <p>The game is over</p>}
        {game.isDrawGame() && <p>There is a draw</p>}
        {game.getWinningPlayer() && <p>There is a winner</p>}
        <p className="text-xl mb-8">{id}</p>
 */

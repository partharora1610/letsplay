"use client"

import React, { useCallback, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useWebSocket } from "@/context/SocketContext"
import useGameStore from "@/zustand/game.store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuthStore from "@/zustand/user.store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// const JOIN_GAME = "join_game"
// const GAME_STATE = "game_state"

const GAME_OVER = "game_over"
const GAME_STARTED = "game_started"
const MAKE_MOVE = "make_move"
const INIT_GAME = "init_game"
const GAME_ADDED = "game_added"

interface Event {
  data: string
}

const Page = () => {
  const socket = useWebSocket()
  const { game, updateGameMetadata, makeMove } = useGameStore()
  const { id } = useParams()
  const router = useRouter()

  const handleWebSocketMessage = useCallback(
    (event: Event) => {
      const message = JSON.parse(event.data)
      console.log(message)

      switch (message.type) {
        case GAME_ADDED:
          console.log("Game added")
          break

        case GAME_STARTED:
          console.log("Game started")
          updateGameMetadata(message.payload)
          if (id === "online") {
            router.push(`/game/${message.payload.gameId}`)
          }
          break

        case MAKE_MOVE:
          const move = message.payload.move
          makeMove(Math.floor(move / 3), move % 3)
          break

        case GAME_OVER:
          console.log("Game over")
          break

        default:
          console.log("Unhandled message type:", message.type)
      }
    },
    [game, updateGameMetadata, router, id]
  )

  useEffect(() => {
    if (!socket) return

    // Can Improve this
    if (id === "online") {
      socket.send(
        JSON.stringify({
          type: INIT_GAME,
        })
      )
    }

    socket.addEventListener("message", handleWebSocketMessage)

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage)
    }
  }, [socket, handleWebSocketMessage])

  if (id === "online") {
    return <ConnectingCard />
  }

  return (
    <div className="min-h-screen text-white">
      <GameMetadata />

      {/* {JSON.stringify(game.board)} */}
      {/* <p className="text-xl mb-8">{id}</p> */}
      <div className="flex flex-col items-center justify-center mt-40">
        <GameBoard />
      </div>
      {/* {game.isGameOver() && <p>The game is over</p>}
      {game.isDrawGame() && <p>There is a draw</p>}
      {game.getWinningPlayer() && <p>There is a winner</p>} */}
    </div>
  )
}

const GameMetadata: React.FC = () => {
  const { gameMetadata } = useGameStore()
  const { user } = useAuthStore()
  const { XPlayer, OPlayer } = gameMetadata
  const userId = user?.id

  const players = [XPlayer, OPlayer]

  return (
    <div>
      <div className="bg-gray-800 m-6 px-4 py-4 rounded-md">
        <div className="flex justify-between">
          {players.map((player, index) => {
            return (
              <MetadataUser
                key={index}
                index={index}
                player={player}
                type={player.id == XPlayer.id ? "X" : "O"}
                loggedIn={userId == player.id}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface MetadataUserProps {
  player: {
    name: string
    id: string
  }
  type: "X" | "O"
  loggedIn: boolean
  index: number
}

const MetadataUser: React.FC<MetadataUserProps> = ({
  player,
  type,
  loggedIn,
  index, // use this to place them properly...
}) => {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <div>
          <p className="text-white text-lg">Player {type}</p>
          <p className="text-white text-sm">{player.name}</p>
        </div>
        <div
          className={`rounded-md  ${
            loggedIn && "border-blue-400 p-1 border-4"
          } `}
        >
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
  const { game, gameMetadata } = useGameStore()
  const { user } = useAuthStore()
  const socket = useWebSocket()
  const { id } = useParams()
  const playerVariant = gameMetadata.XPlayer.id === user?.id ? "X" : "O"

  const handleClick = (index: number) => {
    if (game.getActivePlayer() !== playerVariant) return

    const row = Math.floor(index / 3)
    const col = index % 3

    socket?.send(
      JSON.stringify({
        type: MAKE_MOVE,
        payload: {
          gameId: id,
          move: index,
        },
      })
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 relative">
      {game.board.flat().map((value, index) => (
        <button
          key={index}
          className={`w-24 h-24 flex items-center justify-center text-3xl font-bold bg-white border-2 border-gray-300
          ${
            value === "X"
              ? "text-blue-500"
              : value === "O"
              ? "text-red-500"
              : ""
          }
          `}
          onClick={() => handleClick(index)}
          disabled={value !== null}
        >
          {JSON.stringify(value)}
        </button>
      ))}

      {!game.isGameOver() && <GameOverModal />}
    </div>
  )
}

const GameOverModal: React.FC = () => {
  const { game } = useGameStore()

  const getReason = () => {
    if (game.isDrawGame()) {
      return "The game is a draw"
    } else {
      const winner = game.getWinningPlayer()
      return winner ? `Player ${winner} wins` : "Game Over"
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full py-4 bg-gray-600/80 rounded text-white ">
        <div className="flex items-center flex-col justify-center mb-4">
          <h3 className="font-semibold mb-2">GAME OVER</h3>
          <p className="text-3xl">{getReason()}</p>
        </div>
        <div className="flex items-center gap-4 justify-center">
          <Link href="/">
            <Button className="bg-blue-500 cursor-pointer">Exit</Button>
          </Link>
          <Button className="bg-blue-500 cursor-pointer">Play Again</Button>
        </div>
      </div>
    </div>
  )
}

const ConnectingCard: React.FC = () => {
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

export default Page

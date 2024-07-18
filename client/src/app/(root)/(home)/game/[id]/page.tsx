// "use client"

// import { useParams } from "next/navigation"
// import React, { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import TicTacToe from "@/libs/TicTacToe"
// import { useWebSocket } from "@/context/SocketContext"

// const GAME_START = "game_start"
// const GAME_OVER = "game_over"
// const JOIN_GAME = "join_game"
// const MAKE_MOVE = "make_move"
// const GAME_STATE = "game_state"

// type BoardCell = null | "X" | "O"

// interface Metadata {
//   blackPlayer: { id: string; name: string }
//   whitePlayer: { id: string; name: string }
// }

// const Page = () => {
//   const socket = useWebSocket()

//   const router = useRouter()
//   const { id } = useParams()

//   const [gameOver, setGameOver] = useState<boolean>(false)

//   const [draw, setDraw] = useState<boolean>(false)
//   const [winner, setWinner] = useState<any>(null)

//   const [board, setBoard] = useState<BoardCell[][]>(
//     Array.from({ length: 3 }, () => Array(3).fill(null))
//   )
//   const [game, setGame] = useState(new TicTacToe())
//   const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null)

//   const handleClick = (index: number) => {
//     console.log(index)
//     socket?.send(
//       JSON.stringify({
//         type: "make_move",
//         move: index,
//       })
//     )
//   }

//   const sendHandler = () => {
//     socket?.send(
//       JSON.stringify({
//         type: "init_game",
//       })
//     )
//   }

//   useEffect(() => {
//     if (!socket) {
//       return
//     }

//     socket.onmessage = function (event) {
//       const message = JSON.parse(event.data)
//       console.log(message)

//       switch (message.type) {
//         case GAME_START:
//           setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)))
//           router.push(`/game/${message.payload.gameId}`)
//           break

//         case GAME_STATE:
//           setBoard(message.payload.board)
//           break

//         case MAKE_MOVE:
//           setBoard(message.payload.board)
//           break

//         case GAME_OVER:
//           console.log("Game over route")
//           console.log(message.payload.board)
//           //
//           setBoard(message.payload.board)
//           setGameOver(true)

//           const reason = message.payload.type == "draw" ? "draw" : "winner"

//           if (reason == "draw") {
//             setDraw(true)
//           }

//           if (reason == "winner") {
//             setWinner(message.payload.data)
//           }

//           break

//         default:
//           break
//       }
//     }
//   }, [socket, router])

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <p className="text-2xl mb-4">Game Page</p>
//       {JSON.stringify(board)}
//       <p className="text-xl mb-8">{id}</p>

//       {/* The game state to the user */}
//       {gameOver && <p>The game is over</p>}
//       {draw && <p>There is a draw</p>}
//       {winner && <p>There is a winner {winner}</p>}
//       {/*  */}

//       <div className="grid grid-cols-3 gap-2">
//         {board.flat().map((value, index) => (
//           <button
//             key={index}
//             className={`w-24 h-24 flex items-center justify-center text-3xl font-bold bg-white border-2 border-gray-300
//               ${
//                 value === "X"
//                   ? "text-blue-500"
//                   : value === "O"
//                   ? "text-red-500"
//                   : ""
//               }
//               `}
//             onClick={() => handleClick(index)}
//             disabled={value !== null} // Disable the button if there's already a move
//           >
//             {JSON.stringify(value)}
//           </button>
//         ))}
//       </div>

//       <button
//         className="bg-blue-400 mt-20 text-white rounded-md p-2"
//         onClick={sendHandler}
//       >
//         Play Game
//       </button>
//     </div>
//   )
// }

// export default Page
import React from "react"

const page = () => {
  return <div>page</div>
}

export default page

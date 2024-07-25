"use client"
const GAME_START = "game_start"
const JOIN_GAME = "join_game"
const MAKE_MOVE = "make_move"
const GAME_STATE = "game_state"

import Link from "next/link"
import React, { useState } from "react"

export default function Home() {
  return (
    <div className=" flex justify-center m-auto">
      <Main />
    </div>
  )
}

const DATA = [
  { rank: 1, name: "XSET sleny", stats: "34 / 3 / 67", score: 1714 },
  { rank: 2, name: "Oliver", stats: "28 / 0 / 50", score: 1600 },
  { rank: 3, name: "Nico", stats: "28 / 1 / 47", score: 1574 },
  { rank: 4, name: "Ludi", stats: "23 / 0 / 53", score: 1539 },
  { rank: 5, name: "Smoky", stats: "14 / 0 / 37", score: 1336 },
  { rank: 6, name: "SRC 6.1 o", stats: "13 / 1 / 18", score: 1267 },
  { rank: 120, name: "dev", stats: "0 / 1 / 0", score: 1000 },
]

const Main = () => {
  const [leaderboard, setLeaderboard] = useState(DATA)

  return (
    <div className="flex-1 bg-gray-900 p-4 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-white text-center">
          Play Tic Tac Toe
        </h1>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <Link href="/game/online">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-2 w-full">
                Play online
              </button>
            </Link>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2 w-full">
              Play with a friend
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mb-2 w-full">
              Play vs robot
            </button>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl mb-6 text-white font-semibold underline">
              Leaderboard
            </h2>
            <div className="flex flex-col gap-5">
              {/* {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className="flex justify-between text-gray-200"
                >
                  <div className="flex gap-5">
                    <span className="text-lg">#{player.rank}</span>

                    <div className="flex gap-2">
                      <Avatar>
                        <AvatarImage
                          className="w-8 h-8 rounded-full"
                          src="https://github.com/shadcn.png"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span>{player.name}</span>
                    </div>
                  </div>
                  <span className="text-lg font-medium">{player.score}</span>
                </div>
              ))} */}
            </div>
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">
              See all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

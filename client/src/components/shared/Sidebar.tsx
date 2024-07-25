"use client"

import Link from "next/link"
import { Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Login from "@/components/shared/Login"
import useAuthStore from "@/zustand/user.store"
import { useSocket } from "@/hooks/useSocket"

const Sidebar = () => {
  const { user, isAuthenticated } = useAuthStore()
  const socket = useSocket()

  return (
    <div className="w-64 flex-shrink-0 bg-gray-800 p-4">
      <div>
        {/* {JSON.stringify(user)} */}
        <div className="flex items-center gap-3">
          <Avatar className="rounded-md w-12 h-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white font-semibold mb-1">@{user?.name}</span>
            <div className="flex gap-2 items-center">
              <Star size={18} strokeWidth={5} className="text-yellow-500" />
              <span className="font-bold text-yellow-500">2000</span>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gray-500 rounded-full mb-8 mt-4"></div>
        <div className="text-gray-400 flex flex-col gap-3 ">
          <Link
            href="/history"
            className="block py-2 px-3 rounded hover:bg-gray-700"
          >
            Match History
          </Link>

          <Link href="#" className="block py-2 px-3 rounded hover:bg-gray-700">
            Play Online
          </Link>

          <Link href="#" className="block py-2 px-3 rounded hover:bg-gray-700">
            Play Friends
          </Link>

          <Link
            href="/leaderboard"
            className="block py-2 px-3 rounded hover:bg-gray-700"
          >
            Global Leaderboard
          </Link>
        </div>
      </div>

      {!isAuthenticated && (
        <Login>
          <Button className="w-full bg-gray-100 mt-20">Signin</Button>
        </Login>
      )}

      {/*  */}
      {/* <Button
        onClick={() => {
          socket?.send(JSON.stringify({ type: "init_game" }))
        }}
      >
        Testing Game
      </Button> */}
    </div>
  )
}

export default Sidebar

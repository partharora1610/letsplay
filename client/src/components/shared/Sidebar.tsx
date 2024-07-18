"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Login from "@/components/shared/Login"
import useAuthStore from "@/zustand/user.store"

import { Star } from "lucide-react"
const Sidebar = () => {
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div className="w-64 bg-gray-800 p-4">
      <div>
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

      {/* {isAuthenticated && (
        <Button className="w-full bg-red-200/80 mt-20">Signout</Button>
      )} */}
    </div>
  )
}

export default Sidebar

"use client"
import useFetchUser from "@/hooks/useFetchUser"
import React from "react"

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  useFetchUser()

  return <>{children}</>
}

export default AuthContext

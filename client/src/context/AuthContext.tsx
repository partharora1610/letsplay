"use client"
import useAuthStore from "@/zustand/user.store"
import axios from "axios"
import React, { useEffect } from "react"

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuthStore()

  const { setLoading, setUser, clearUser } = useAuthStore()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await axios.get("http://localhost:8000/user", {
          withCredentials: true,
        })

        console.log({ response })

        if (response.status == 200) {
          setLoading(false)
          setUser(response.data.result)
        } else {
          setLoading(false)
          clearUser()
        }
      } catch (error) {
        setLoading(false)
        clearUser()
        console.error("Failed to fetch user", error)
      }
    }

    fetchUser()
  }, [setUser, clearUser])

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthContext

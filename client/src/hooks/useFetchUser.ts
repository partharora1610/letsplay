import { useEffect } from "react"
import axios from "axios"
import useAuthStore from "@/zustand/user.store"

const useFetchUser = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)
  const setLoading = useAuthStore((state) => state.setLoading)

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
}

export default useFetchUser

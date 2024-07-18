import useAuthStore from "../zustand/user.store"
import axios from "axios"

export const loginAPI = async (code: string) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/auth/google/callback",
      {
        code,
      },
      {
        withCredentials: true,
      }
    )

    const user = response.data.user
    useAuthStore.getState().setUser(user)
  } catch (error) {
    console.error("Login failed", error)
  }
}

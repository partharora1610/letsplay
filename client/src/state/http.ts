import Axios from "axios"

const AxiosClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
})

export default AxiosClient

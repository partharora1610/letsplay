import { loginAPI } from "@/utils/auth"
import { useGoogleLogin } from "@react-oauth/google"

const Login = ({ children }: { children: React.ReactNode }) => {
  const login = useGoogleLogin({
    onSuccess: async ({ code }: { code: string }) => {
      const response = await loginAPI(code)
    },

    flow: "auth-code",
    scope: "email profile openid",
  })

  return (
    <div
      onClick={() => {
        login()
      }}
    >
      {children}
    </div>
  )
}

export default Login

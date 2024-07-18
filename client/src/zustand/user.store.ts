import create from "zustand"

interface User {
  id: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  setUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  setUser: (user: User) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading: boolean) => set({ loading }),
}))

export default useAuthStore

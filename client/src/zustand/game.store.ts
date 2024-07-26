import TicTacToe from "@/lib/TicTacToe"
import { Board } from "@/types"
import { create } from "zustand"

interface GameState {
  game: TicTacToe
  gameMetadata: {
    XPlayer: { id: string; name: string }
    OPlayer: { id: string; name: string }
  }
  updateGameMetadata: (metadata: GameState["gameMetadata"]) => void
}

const useGameStore = create<GameState>((set) => ({
  game: new TicTacToe(),
  gameMetadata: {
    XPlayer: { id: "", name: "" },
    OPlayer: { id: "", name: "" },
  },

  updateGameMetadata: (metadata) => {
    set(() => ({ gameMetadata: metadata }))
  },
}))

export default useGameStore

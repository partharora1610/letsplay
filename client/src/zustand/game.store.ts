import TicTacToe from "@/lib/TicTacToe"
import { Board } from "@/types"
import { create } from "zustand"

interface GameState {
  game: TicTacToe
  board: Board
  gameMetadata: {
    XPlayer: { id: string; name: string }
    OPlayer: { id: string; name: string }
  }
  updateGameState: () => void
  updateGameMetadata: (metadata: GameState["gameMetadata"]) => void
}

const useGameStore = create<GameState>((set) => ({
  game: new TicTacToe(),
  board: Array.from({ length: 3 }, () => Array(3).fill(null)),
  gameMetadata: {
    XPlayer: { id: "", name: "" },
    OPlayer: { id: "", name: "" },
  },
  updateGameState: () => {
    set((state) => ({ board: state.game.getBoard() }))
  },
  updateGameMetadata: (metadata) => {
    set(() => ({ gameMetadata: metadata }))
  },
}))

export default useGameStore

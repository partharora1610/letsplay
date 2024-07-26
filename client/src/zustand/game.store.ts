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
  updateGameMetadata: (metadata: GameState["gameMetadata"]) => void
  makeMove: (row: number, col: number) => void
}

const useGameStore = create<GameState>((set) => ({
  game: new TicTacToe(),
  board: Array.from({ length: 3 }, () => Array(3).fill(null)),

  gameMetadata: {
    XPlayer: { id: "", name: "" },
    OPlayer: { id: "", name: "" },
  },

  makeMove: (row, col) => {
    set((state) => {
      state.game.makeMove(row, col)
      return { board: state.game.board }
    })
  },

  updateGameMetadata: (metadata) => {
    set(() => ({ gameMetadata: metadata }))
  },
}))

export default useGameStore

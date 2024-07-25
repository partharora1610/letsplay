export type Player = "X" | "O" | null
export type Board = Player[][]

export interface GameHistory {
  board: Board
  move: string
  player: Player
}

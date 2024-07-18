import { WebSocket } from "ws"
import TicTacToe from "./TicTacToe"
import { v4 as uuidv4 } from "uuid"

class Game {
  public player1: WebSocket
  public player2: WebSocket
  private board: TicTacToe

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1
    this.player2 = player2
    this.board = new TicTacToe()

    // notify players that the game has started
    this.notifyPlayers()
  }

  async notifyPlayers() {
    const gameId = uuidv4()

    // Also need to create players in the database
    // Technically this should happen inside a primsa transaction

    // const newGame = await prisma.game.create({
    //   data: {},
    // })

    // if (!newGame) {
    //   return
    // }
    // we will use newGame.id to send

    this.player1.send(
      JSON.stringify({
        type: "game_start",
        payload: { player: "X", gameId },
      })
    )

    this.player2.send(
      JSON.stringify({
        type: "game_start",
        payload: { player: "O", gameId },
      })
    )
  }

  makeMove(player: WebSocket, move: string) {
    // here I will have to push all the moves to the redis queue from where it will picked and db entry will be created....

    const row = Math.floor(parseInt(move) / 3)
    const col = parseInt(move) % 3

    if (this.board.isValidMove(row, col)) {
      this.board.makeMove(row, col)

      /**
       * redis.queue.push(move)
       */
    } else {
      player.send(JSON.stringify({ type: "invalid_move" }))
      return
    }

    if (this.board.isDrawGame()) {
      this.player1.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            type: "draw",
            board: this.board.getBoard(),
          },
        })
      )

      this.player2.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            type: "draw",
            data: null,
            board: this.board.getBoard(),
          },
        })
      )

      // update the game status in the database
      return
    }

    // If the game is over and not draw, then we have winner that we send to both the players
    if (this.board.isGameOver()) {
      const winner = this.board.getWinner()
      const board = this.board.getBoard()

      this.player1.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            type: "winner",
            data: winner,
            board,
          },
        })
      )

      this.player2.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            type: "winner",
            data: winner,
            board,
          },
        })
      )

      // update the game statud in database
      return
    }

    // These are already pushed to the redis queue from they will be picked...
    this.player1.send(
      JSON.stringify({
        type: "make_move",
        payload: {
          type: "updateboard",
          data: null,
          board: this.board.getBoard(),
        },
      })
    )

    this.player2.send(
      JSON.stringify({
        type: "make_move",
        payload: {
          type: "updateboard",
          data: null,
          board: this.board.getBoard(),
        },
      })
    )

    // Here we send the updated board to the other user
    // Not sending to the frontend, since the game login will also be there on the frontend
    // if (this.board.getMoves().length % 2 === 0) {
    //   this.player2.send(
    //     JSON.stringify({ type: "make_move", payload: this.board.getBoard() })
    //   )
    // } else {
    //   this.player1.send(
    //     JSON.stringify({ type: "make_move", payload: this.board.getBoard() })
    //   )
    // }
  }
}

export default Game

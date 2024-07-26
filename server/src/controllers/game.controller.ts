import { Request, Response } from "express"
import AbstractController from "./index.controller"
import UserDto from "dtos/User.dto"

export default class GameController extends AbstractController {
  getAll() {
    return [
      async (req: Request, res: Response) => {
        const userId = req.session.currentUserId

        const games = await this.ctx.db.client.game.findMany({
          where: {
            OR: [{ playerOId: userId }, { playerXId: userId }],
          },
          include: {
            playerO: {
              select: UserDto,
            },
            playerX: {
              select: UserDto,
            },
          },
        })

        return res.json({
          result: games,
        })
      },
    ]
  }
}

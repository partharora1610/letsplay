import { Request, Response } from "express"
import AbstractController from "./index.controller"
import UserDto from "dtos/User.dto"

export default class UserController extends AbstractController {
  get() {
    return [
      async (req: Request, res: Response) => {
        console.log({ id: req.session.currentUserId })

        const user = await this.ctx.db.client.user.findFirst({
          where: { id: req.session.currentUserId },
          select: UserDto,
        })

        return res.json({
          result: user,
        })
      },
    ]
  }

  getLogout() {
    return [
      (req: Request, res: Response) => {
        req.session.currentUserId = undefined
        return res.sendStatus(204)
      },
    ]
  }
}

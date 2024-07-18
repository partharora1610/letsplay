import { NextFunction, Request, Response } from "express"
import AbstractController from "./index.controller"
import googleOAuthClient from "libs/google.lib"
import { InternalServerError } from "errors/internal-server-error"
import Transaction from "database/Transaction"

export default class AuthController extends AbstractController {
  postAuthGoogleCallback() {
    return [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { code } = req.body as unknown as { code: string }
          console.log(req.body)
          console.log({ code })

          const payload =
            await googleOAuthClient.getTokenAndVerifyFromCode(code)

          let exists = true

          const data = {
            existingUser: await this.ctx.db.client.user.findFirst({
              where: {
                sub: payload.sub,
              },
            }),
          }

          if (data.existingUser == null) {
            exists = false
            const transaction = new Transaction(this.ctx)

            await transaction.execute(async (ctx) => {
              data.existingUser = await ctx.db.client.user.create({
                data: {
                  email: payload.email as string,
                  name: payload.given_name as string,
                  sub: payload.sub,
                },
              })
            })
          }

          console.log({ user: data.existingUser })

          req.session.currentUserId = data?.existingUser?.id
          return res.sendStatus(exists ? 200 : 201)
        } catch (e) {
          console.error(e)
          next(new InternalServerError())
        }
      },
    ]
  }
}

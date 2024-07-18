import Express, {
  NextFunction,
  Request,
  Response,
  Express as TExpress,
} from "express"
import logger from "middlewares/logger.middleware"
import getEnvVar from "env/index"
import Context from "database/Context"
import { RouteNotFoundError } from "errors/route-not-found-error"
import { IDatabase } from "interfaces/database"
import cors from "cors"
import error from "middlewares/error.middleware"
import cookieSession from "cookie-session"
import AuthRouter from "routers/auth.router"
import UserRouter from "routers/user.router"

export default class Server {
  db: IDatabase
  engine: TExpress

  constructor(database: IDatabase) {
    this.db = database
    this.engine = Express()
  }

  #registerMiddlewares() {
    this.engine.use(logger())
    this.engine.use(Express.json())

    this.engine.use(
      cors({ credentials: true, origin: "http://localhost:3000" })
    )
    this.engine.use(
      cookieSession({
        secure: false,
        httpOnly: true,
        secret: getEnvVar("COOKIE_SECRET"),
        signed: true,
        name: "game-session",
      })
    )
  }

  #registerHandlers() {
    this.engine.get(
      "/",
      (() => {
        console.log(`registered: GET /`)
        return (_: Request, res: Response) => {
          return res.sendStatus(200)
        }
      })()
    )

    this.engine.get(
      "/health",
      (() => {
        console.log(`registered: GET /health`)
        return (_: Request, res: Response) => {
          return res.sendStatus(200)
        }
      })()
    )

    const ctx = new Context(this.db)

    const authRouter = new AuthRouter(ctx, this.engine, "/auth")
    const userRouter = new UserRouter(ctx, this.engine, "/user")

    authRouter.register()
    userRouter.register()

    this.engine.get("/health", (req, res) => {
      console.log("health check")
      return res.status(200).send("ok")
    })

    this.engine.all(
      "*",
      async (__: Request, _: Response, next: NextFunction) => {
        return next(new RouteNotFoundError())
      }
    )
  }

  start() {
    this.#registerMiddlewares()
    this.#registerHandlers()
    this.engine.use(error())
    this.engine.listen(parseInt(getEnvVar("PORT")), () => {
      console.log(`\nServer listening at ${getEnvVar("PORT")}`)
    })
  }
}

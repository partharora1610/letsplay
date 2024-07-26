import AbstractRouter from "."
import isAuthenticated from "middlewares/isAuthenticated.middleware"
import GameController from "controllers/game.controller"

export default class GameRouter extends AbstractRouter {
  registerMiddlewares() {
    return [isAuthenticated]
  }

  registerRoutes(): void {
    const gameController = new GameController(this.ctx)
    this.registerGET("/", gameController.getAll())
  }
}

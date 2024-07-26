import LeaderBoardController from "controllers/leaderboard.controller"
import AbstractRouter from "."
import isAuthenticated from "middlewares/isAuthenticated.middleware"

export default class LeaderBoardRouter extends AbstractRouter {
  registerMiddlewares() {
    return [isAuthenticated]
  }

  registerRoutes(): void {
    const leaderBoardController = new LeaderBoardController(this.ctx)
    this.registerGET("/", leaderBoardController.get())
  }
}

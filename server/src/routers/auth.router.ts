import AuthController from "controllers/auth.controller"
import AbstractRouter from "."

export default class AuthRouter extends AbstractRouter {
  registerMiddlewares() {
    return []
  }

  registerRoutes(): void {
    const authController = new AuthController(this.ctx)
    this.registerPOST(
      "/google/callback",
      authController.postAuthGoogleCallback()
    )
  }
}

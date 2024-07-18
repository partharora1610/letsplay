import UserController from 'controllers/user.controller';
import AbstractRouter from '.';
import isAuthenticated from 'middlewares/isAuthenticated.middleware';

export default class UserRouter extends AbstractRouter {
  registerMiddlewares() {
    return [isAuthenticated];
  }

  registerRoutes(): void {
    const userController = new UserController(this.ctx);
    this.registerGET('/', userController.get());
    this.registerGET('/logout', userController.getLogout());
  }
}

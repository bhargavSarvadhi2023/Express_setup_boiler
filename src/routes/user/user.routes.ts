import { userValidation } from '../../validation/basic.Validation';
import { userController } from '../../controller/user/user.controller';
import BaseRoute from '../base.routes';

class UserRoutes extends BaseRoute {
    async initializeRoutes() {
        this.router.get('/', userController.getData.bind(userController));
        this.router.delete('/:id', userController.delete.bind(userController));
        this.router.put(
            '/:id',
            userValidation,
            userController.update.bind(userController),
        );
    }
}
export const userRoutes = new UserRoutes().router;

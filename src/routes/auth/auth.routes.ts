import { userValidation } from '../../validation/basic.Validation';
import { authController, userController } from '../../controller/index';
import BaseRoute from '../base.routes';

class AuthRoutes extends BaseRoute {
    async initializeRoutes() {
        this.router.post('/login', authController.login);
        this.router.post(
            '/signup',
            userValidation,
            userController.create.bind(userController),
        );
        this.router.post('/otp', authController.forgetPassword);
        this.router.post('/checkvalidateotp', authController.checkValidateOtp);
        this.router.put('/reset-password', authController.resetPassword);
    }
}
export const authRoutes = new AuthRoutes().router;

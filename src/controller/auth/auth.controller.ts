import { db } from '../../model';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { ERRORTYPES, MODEL, RES_TYPES } from '../../constant';
import { AppError } from '../../utils';
import { TokenController } from '../../config/passport.jwt';

class AuthController {
    constructor() {
        this.GenrateOTP = this.GenrateOTP.bind(this);
    }

    async login(req, res, next) {
        try {
            const {
                body: { email, password },
            } = req;
            const result = await db[MODEL.USERMODEL].findOne({
                where: { email },
            });
            if (result && result.authenticate(password)) {
                const payload = {
                    id: result.id,
                    Email: result.email,
                };
                const token = await TokenController.createToken(payload, next);
                return res.status(200).json({
                    success: true,
                    data: token,
                    message: RES_TYPES.LOGIN,
                });
            } else {
                return next(
                    new AppError(RES_TYPES.AUTH_FAIL, ERRORTYPES.UNAUTHORIZED),
                );
            }
        } catch (error) {
            return next(error);
        }
    }

    async GenrateOTP() {
        const min = 100000;
        const max = 999999;
        const currentTime = new Date();
        const expiresIn = Math.floor(
            (currentTime.getTime() + 10 * 60 * 1000) / 1000,
        );
        const otp = Math.floor(Math.random() * (max - min + 1)) + min;
        return { otp, expiresIn };
    }

    async forgetPassword(req, res, next) {
        try {
            const {
                body: { email },
            } = req;
            let saveOtp;
            const user = await db[MODEL.USERMODEL].findOne({
                where: { email },
            });
            if (!user) {
                throw new AppError(
                    RES_TYPES.USER_NOT_FOUND,
                    ERRORTYPES.NOT_FOUND,
                );
            }
            const { otp, expiresIn } = await authController.GenrateOTP();
            const checkotp = await db[MODEL.OTPMODEL].findOne({
                where: { userId: user.id },
            });
            if (checkotp) {
                saveOtp = await db[MODEL.OTPMODEL].update(
                    { otp, expiresIn },
                    { where: { userId: user.id } },
                );
            } else {
                saveOtp = await db[MODEL.OTPMODEL].create({
                    otp,
                    expiresIn,
                    userId: user.id,
                });
            }
            return res.status(200).json({
                success: true,
                message: RES_TYPES.OTP,
            });
        } catch (error) {
            return next(error);
        }
    }

    async checkValidateOtp(req, res, next) {
        try {
            const currentTime = Math.floor(new Date().getTime() / 1000);
            const {
                body: { otp },
            } = req;
            const findOtp = await db[MODEL.OTPMODEL].findOne({
                where: { otp },
            });
            console.log(currentTime);
            console.log(findOtp.expiresIn);
            if (!findOtp || currentTime > findOtp.expiresIn) {
                throw new AppError(
                    RES_TYPES.NOT_VALIDATE_OTP,
                    ERRORTYPES.INVALID_REQUEST,
                );
            }
            const payload = { id: findOtp.userId };
            const Otptoken = await TokenController.createToken(payload, next);
            console.log(Otptoken);
            return res.status(200).json({
                success: true,
                data: Otptoken,
                message: RES_TYPES.VALIDATE_OTP,
            });
        } catch (error) {
            return next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const {
                body: { token, password },
            } = req;
            const decodeToken: jwt.JwtPayload =
                (await TokenController.decodeToken(
                    token,
                    next,
                )) as jwt.JwtPayload;
            const [updatePassword] = await db[MODEL.USERMODEL].update(
                { password },
                { where: { id: decodeToken.id } },
            );
            if (!updatePassword || updatePassword == 0) {
                throw new AppError(
                    RES_TYPES.ID_NOT_FOUND,
                    ERRORTYPES.NOT_FOUND,
                );
            }
            const deleteOtp = await db[MODEL.OTPMODEL].destroy({
                where: { userId: decodeToken.id },
            });
            return res.status(200).json({
                success: true,
                message: RES_TYPES.UPDATE,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();

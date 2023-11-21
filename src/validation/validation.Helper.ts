import { ERRORTYPES } from '../constant/index';
import { AppError } from '../utils';

export const validateReq = (req, next, userSchema) => {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        throw new AppError(
            `Validation error: ${error.details[0].message}`,
            ERRORTYPES.INVALID_REQUEST,
        );
    } else {
        req.body = value;
        next();
    }
};

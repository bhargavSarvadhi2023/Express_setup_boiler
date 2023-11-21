import Joi from 'joi';
import { validateReq } from './validation.Helper';

class CommanValidationFilter {
    password() {
        return Joi.string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            )
            .required()
            .messages({
                'string.pattern.base':
                    'Password should be this type contain like ex:- Abc@123  ',
                'string.empty': 'Password cannot be empty',
            });
    }
    phone() {
        return Joi.string()
            .pattern(/^\+[0-9]{1,}$/)
            .length(13)
            .required()
            .messages({
                'string.pattern.base':
                    'Please provide valid phone number with +91 formate',
                'string.empty': 'phone number cannot be empty',
                'string.length': 'Please provide 10 digits phone number',
            });
    }
}

export const userValidation = (req, res, next) => {
    const userSchema = Joi.object({
        username: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phone: new CommanValidationFilter().phone(),
        email: Joi.string().email().required(),
        password: new CommanValidationFilter().password(),
        role: Joi.string().valid('admin', 'user').required(),
    });
    validateReq(req, next, userSchema);
};

export const loginValidation = (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: new CommanValidationFilter().password(),
    });
    validateReq(req, next, loginSchema);
};

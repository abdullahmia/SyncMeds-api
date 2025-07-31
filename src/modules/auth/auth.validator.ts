import Joi from "joi";

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
  }),
};

export const forgotPasswordSchema = {
  body: {
    email: Joi.string().email().required(),
  },
};

export const resetPasswordSchema = {
  body: {
    email: Joi.string().email().required(),
    otp: Joi.string().max(6).required(),
    new_password: Joi.string().min(8),
  },
};

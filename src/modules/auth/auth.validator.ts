import Joi from "joi";

export const forgotPasswordSchema = {
  body: {
    email: Joi.string().email().required(),
  },
};

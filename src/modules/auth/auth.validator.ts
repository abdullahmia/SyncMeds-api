import Joi from "joi";

export const forgotPasswordSchema = {
  body: {
    email: Joi.string().email().required(),
  },
};

// export const resetPasswordSchema = {
//   body: {
//     email: Joi.string().email().required(),
//     otp: Joi.string().max(6).required().message("Otp should be valid!"),
//     newPassword: Joi.string()
//       .min(8)
//       .message("Password should have at least 8 characters"),
//   },
// };

export const resetPasswordSchema = {
  body: {
    email: Joi.string().email().required(),
    otp: Joi.string().max(6).required(),
    new_password: Joi.string().min(8),
  },
};

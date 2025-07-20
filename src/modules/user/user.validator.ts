import { User } from "@/generated/prisma";
import Joi from "joi";

const userSchema = Joi.object<User>({
  name: Joi.string().min(3).messages({
    "string.min": "Name should have at least 3 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().message("Email must be a valid email!"),
  password: Joi.string().min(8).messages({
    "string.min": "Password should have at least 8 characters",
  }),
});

export const createUserSchema = {
  body: userSchema.fork(["name", "email", "password"], (schema) =>
    schema.required()
  ),
};

export const updateUserSchema = {
  params: {
    id: Joi.string().uuid().required(),
  },
  body: {
    name: Joi.string().min(3).required(),
  },
};

export const userById = {
  params: {
    id: Joi.string().uuid().required(),
  },
};

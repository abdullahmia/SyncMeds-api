import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as userController from "./user.controller";
import { createUserSchema, updateUserSchema, userById } from "./user.validator";

const router: Router = Router();

router
  .route("/")
  .get(AuthMiddleware.authenticateJWT, userController.getAllUsers)
  .post(validate(createUserSchema), userController.createUser);

router
  .route("/:id")
  .get(validate(userById), userController.getUserById)
  .patch(validate(updateUserSchema), userController.updateUserById)
  .delete(validate(userById), userController.deleteUserById);

export { router as userRouter };

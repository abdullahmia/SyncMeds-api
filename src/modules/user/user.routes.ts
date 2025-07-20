import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as userController from "./user.controller";
import { createUserSchema, updateUserSchema, userById } from "./user.validator";

const router: Router = Router();

router
  .route("/")
  .get(AuthMiddleware.authenticateJWT, userController.getAllUsers)
  .post(
    AuthMiddleware.authenticateJWT,
    validate(createUserSchema),
    userController.createUser
  );

router
  .route("/:id")
  .get(
    AuthMiddleware.authenticateJWT,
    validate(userById),
    userController.getUserById
  )
  .patch(
    AuthMiddleware.authenticateJWT,
    validate(updateUserSchema),
    userController.updateUserById
  )
  .delete(
    AuthMiddleware.authenticateJWT,
    validate(userById),
    userController.deleteUserById
  );

export { router as userRouter };

import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as authController from "./auth.controller";
import * as authValidationSchema from "./auth.validator";

const router: Router = Router();

router.post("/login", AuthMiddleware.authenticateLocal, authController.login);
router.post(
  "/forgot-password",
  validate(authValidationSchema.forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authValidationSchema.resetPasswordSchema),
  authController.resetPassword
);

export { router as authRouter };

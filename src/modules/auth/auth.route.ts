import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as authController from "./auth.controller";
import { forgotPasswordSchema } from "./auth.validator";

const router: Router = Router();

router.post("/login", AuthMiddleware.authenticateLocal, authController.login);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

export { router as authRouter };

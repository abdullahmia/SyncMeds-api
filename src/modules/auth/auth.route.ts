import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { Router } from "express";
import * as authController from "./auth.controller";

const router: Router = Router();

router.post("/login", AuthMiddleware.authenticateLocal, authController.login);

export { router as authRouter };

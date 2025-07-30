import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as settingsController from "./settings.controller";
import * as settingsValidator from "./settings.validator";

const router: Router = Router();

router.get("/", AuthMiddleware.authenticateJWT, settingsController.getSettings);
router.patch(
  "/:id",
  validate(settingsValidator.updateSettingsSchema),
  AuthMiddleware.authenticateJWT,
  settingsController.updateSettings
);

export { router as settingsRouter };

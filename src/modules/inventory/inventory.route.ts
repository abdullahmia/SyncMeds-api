import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as inventoryController from "./inventory.controller";
import * as inventoryValidatorSchema from "./inventory.validator";

const router: Router = Router();

router
  .route("/")
  .get(
    validate(inventoryValidatorSchema.getInventoryQuerySchema),
    AuthMiddleware.authenticateJWT,
    inventoryController.getAllInventory
  );

export { router as inventoryRouter };

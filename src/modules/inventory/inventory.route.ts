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
  )
  .post(
    validate(inventoryValidatorSchema.createInventorySchema),
    AuthMiddleware.authenticateJWT,
    inventoryController.addInventory
  );

router.get(
  "/summary",
  AuthMiddleware.authenticateJWT,
  inventoryController.getInventorySummary
);

router
  .route("/:id")
  .get(
    validate(inventoryValidatorSchema.inventoryById),
    AuthMiddleware.authenticateJWT,
    inventoryController.getInventory
  )
  .delete(
    validate(inventoryValidatorSchema.inventoryById),
    AuthMiddleware.authenticateJWT,
    inventoryController.deleteInventoryId
  );

export { router as inventoryRouter };

import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as saleController from "./sale.controller";
import * as saleValidatorSchema from "./sale.validator";

const router: Router = Router();

router
  .route("/")
  .post(
    validate(saleValidatorSchema.createSaleSchema),
    AuthMiddleware.authenticateJWT,
    saleController.addSale
  )
  .get(
    validate(saleValidatorSchema.salesQuerySchema),
    AuthMiddleware.authenticateJWT,
    saleController.getAllSales
  );

router
  .route("/:id")
  .delete(
    validate(saleValidatorSchema.byId),
    AuthMiddleware.authenticateJWT,
    saleController.deleteSale
  );

export { router as saleRouter };

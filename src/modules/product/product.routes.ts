import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as productController from "./product.controller";
import * as productValidator from "./product.validator";

const router: Router = Router();

router
  .route("/")
  .get(
    AuthMiddleware.authenticateJWT,
    validate(productValidator.getProductQuerySchema),
    productController.getAllProduct
  )
  .post(
    AuthMiddleware.authenticateJWT,
    validate(productValidator.createProductSchema),
    productController.createProduct
  );

router
  .route("/:id")
  .get(
    AuthMiddleware.authenticateJWT,
    validate(productValidator.productById),
    productController.getSingleProduct
  )
  .patch(
    AuthMiddleware.authenticateJWT,
    validate(productValidator.updateProductSchema),
    productController.updateProductById
  )
  .delete(
    AuthMiddleware.authenticateJWT,
    validate(productValidator.productById),
    productController.deleteProduct
  );

export { router as productRouter };

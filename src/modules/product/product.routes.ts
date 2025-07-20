import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as productController from "./product.controller";
// import {
//   createProductSchema,
//   getProductQuerySchema,
//   productById,
// } from "./product.validator";
import * as productValidator from "./product.validator";

const router: Router = Router();

router
  .route("/")
  .get(
    validate(productValidator.getProductQuerySchema),
    productController.getAllProduct
  )
  .post(
    validate(productValidator.createProductSchema),
    productController.createProduct
  );

router
  .route("/:id")
  .get(
    validate(productValidator.productById),
    productController.getSingleProduct
  )
  .patch(
    validate(productValidator.updateProductSchema),
    productController.updateProductById
  )
  .delete(
    validate(productValidator.productById),
    productController.deleteProduct
  );

export { router as productRouter };

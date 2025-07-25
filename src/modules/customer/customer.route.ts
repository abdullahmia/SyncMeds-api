import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { validate } from "@/core/middleware/validate.middleware";
import { Router } from "express";
import * as customerController from "./customer.controller";
import * as customerValidatorSchema from "./customer.validator";

const router: Router = Router();

router
  .route("/")
  .get(
    validate(customerValidatorSchema.getCustomerQuerySchema),
    AuthMiddleware.authenticateJWT,
    customerController.getAllCustomer
  )
  .post(
    validate(customerValidatorSchema.createCustomerSchema),
    AuthMiddleware.authenticateJWT,
    customerController.createCustomer
  );

router
  .route("/:id")
  .get(
    validate(customerValidatorSchema.byId),
    AuthMiddleware.authenticateJWT,
    customerController.getCustomerById
  )
  .patch(
    validate(customerValidatorSchema.updateCustomerSchema),
    AuthMiddleware.authenticateJWT,
    customerController.updateCustomerById
  )
  .delete(
    validate(customerValidatorSchema.byId),
    AuthMiddleware.authenticateJWT,
    customerController.deleteCustomerById
  );

export { router as customerRouter };

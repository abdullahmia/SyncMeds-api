import { Inventory } from "@/generated/prisma";
import Joi from "joi";

const inventorySchema = Joi.object<Inventory>({
  product_id: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string",
    "string.empty": "Product ID cannot be empty",
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),
  batch_number: Joi.string().required().messages({
    "string.base": "Batch number must be a string",
    "string.empty": "Batch number cannot be empty",
    "any.required": "Batch number is required",
  }),
  quantity: Joi.number().greater(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
    "any.required": "Quantity is required",
  }),
  location: Joi.string().required().messages({
    "string.base": "Location must be a string",
    "string.empty": "Location cannot be empty",
    "any.required": "Location is required",
  }),
  reorder_level: Joi.number().greater(0).messages({
    "number.base": "Reorder level must be a number",
    "number.min": "Reorder level cannot be negative",
  }),
});

export const createInventorySchema = {
  body: inventorySchema.fork(
    ["product_id", "batch_number", "quantity", "location", "reorder_level"],
    (schema) => schema.required()
  ),
};

export const inventoryById = {
  params: {
    id: Joi.string().uuid().required(),
  },
};

export const getInventoryQuerySchema = {
  query: {
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().allow("").optional(),
    order_by: Joi.string().optional().default("DESC"),
  },
};

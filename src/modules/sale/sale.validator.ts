// export const createSaleSchema = Joi.object({
//   inventory_id: Joi.string().uuid().required(),
//   invoice_number: Joi.string().required(),
//   customer_id: Joi.string().uuid().required(),
//   user_id: Joi.string().uuid().optional(),
//   sale_date: Joi.date().optional(),
//   total_amount: Joi.number().precision(2).required(),
//   payment_method: Joi.string()
//     .valid("CASH", "CARD", "BANK_TRANSFER")
//     .optional(),
//   payment_status: Joi.string().valid("PAID", "UNPAID").optional(),
//   notes: Joi.string().allow("", null).optional(),
//   items: Joi.array()
//     .items(
//       Joi.object({
//         product_id: Joi.string().uuid().required(),
//         quantity_sold: Joi.number().integer().min(1).required(),
//         unit_price: Joi.number().precision(2).required(),
//       })
//     )
//     .min(1)
//     .required(),
// });

import { PaymentMethod, PaymentStatus } from "@/generated/prisma";
import Joi from "joi";

const saleSchema = Joi.object({
  inventory_id: Joi.string().uuid(),
  invoice_number: Joi.string(),
  customer_id: Joi.string().uuid(),
  user_id: Joi.string().uuid(),
  payment_method: Joi.string().valid(...Object.values(PaymentMethod)),
  payment_status: Joi.string().valid(...Object.values(PaymentStatus)),
  notes: Joi.string().allow("", null).optional(),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string().uuid(),
      quantity: Joi.number().greater(0).min(1),
      unit_price: Joi.number().precision(2),
    })
  ),
});

export const createSaleSchema = {
  body: saleSchema.fork(
    [
      "inventory_id",
      "invoice_number",
      "customer_id",
      "user_id",
      "payment_method",
      "payment_status",
      "items",
    ],
    (schema) => schema.required()
  ),
};

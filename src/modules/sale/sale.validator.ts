import { PaymentMethod, PaymentStatus } from "@/generated/prisma";
import Joi from "joi";

const saleSchema = Joi.object({
  invoice_number: Joi.string(),
  customer_id: Joi.string().uuid(),
  user_id: Joi.string().uuid(),
  payment_method: Joi.string().valid(...Object.values(PaymentMethod)),
  payment_status: Joi.string().valid(...Object.values(PaymentStatus)),
  notes: Joi.string().allow("", null).optional(),
  items: Joi.array().items(
    Joi.object({
      inventory_id: Joi.string().uuid(),
      quantity: Joi.number().greater(0).min(1),
    })
  ),
});

export const createSaleSchema = {
  body: saleSchema.fork(
    [
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

export const salesQuerySchema = {
  query: Joi.object({
    page: Joi.number()
      .default(1)
      .custom((value) => Number(value)),
    limit: Joi.number()
      .default(10)
      .custom((value) => Number(value)),
    search: Joi.string().allow("").optional(),
    order_by: Joi.string()
      .valid("sale_date", "total_amount", "invoice_number", "created_at")
      .default("created_at"),
    order: Joi.string().valid("ASC", "DESC").default("DESC"),
    start_date: Joi.string().isoDate().optional(),
    end_date: Joi.string().isoDate().optional(),
  })
    .unknown(false)
    .custom((value, helpers) => {
      if (value.start_date && value.end_date) {
        const start = new Date(value.start_date);
        const end = new Date(value.end_date);
        if (start > end) {
          return helpers.error("any.invalid", {
            message: "start_date must be before end_date",
          });
        }
      }
      return value;
    }),
};

import { Customer } from "@/generated/prisma";
import Joi from "joi";

const customerSchema = Joi.object<Customer>({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().max(11),
  address: Joi.string(),
});

export const getCustomerQuerySchema = {
  query: {
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().allow("").optional(),
    order_by: Joi.string().optional().default("DESC"),
  },
};

export const createCustomerSchema = {
  body: customerSchema.fork(["name", "email", "phone", "address"], (schema) =>
    schema.required()
  ),
};

export const byId = {
  params: {
    id: Joi.string().uuid().required(),
  },
};

export const updateCustomerSchema = {
  params: {
    id: Joi.string().uuid().required(),
  },
  body: customerSchema
    .fork(["name", "email", "phone", "address"], (schema) => schema.optional())
    .min(1),
};

import Joi from "joi";

export const getProductQuerySchema = {
  query: {
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    search: Joi.string().allow("").optional(),
  },
};

export const productById = {
  params: {
    id: Joi.string().uuid().required(),
  },
};

const decimalString = Joi.number().precision(2).strict().messages({
  "number.base": "{#label} must be a valid number",
});

const productSchema = Joi.object({
  product_name: Joi.string().min(2),
  generic_name: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),
  manufacturer: Joi.string(),
  sku: Joi.string(),
  selling_price: decimalString,
  cost_price: decimalString,
  required_prescription: Joi.boolean(),
  track_exprires: Joi.boolean(),
});

export const createProductSchema = {
  body: productSchema.fork([], (s) => s.required()),
};

export const updateProductSchema = {
  params: {
    id: Joi.string().uuid().required(),
  },
  body: productSchema
    .fork([], (s) => s.optional())
    .min(1)
    .message("Minimum one field required!"),
};

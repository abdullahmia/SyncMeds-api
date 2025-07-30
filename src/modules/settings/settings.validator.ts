import Joi from "joi";

const settingsSchema = Joi.object({
  pharmacy_name: Joi.string(),
  business_email: Joi.string().email(),
  business_address: Joi.string(),
  business_phone_number: Joi.string(),
  registration_number: Joi.string(),
  tax_id: Joi.string(),
  currency: Joi.string(),
  currency_symbol: Joi.string(),
  date_format: Joi.string(),
  time_zone: Joi.string(),
  invoice_prefix: Joi.string(),
  invoice_footer: Joi.string().allow(""),
  payment_terms: Joi.string().allow(""),
  last_updated_by_id: Joi.string().uuid().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one setting must be provided.",
  });

export const updateSettingsSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: settingsSchema,
};

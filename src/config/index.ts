import dotenv from "dotenv";
import Joi from "joi";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(8000),
    DATABASE_URL: Joi.string().required().description("Postgres database url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.string()
      .default("1h")
      .description("Hour after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.string()
      .default("7d")
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    SMTP_SERVICE: Joi.string().default("Gmail").required(),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    REDIS_URL: Joi.string().required(),
    REDIS_PORT: Joi.number().description("Redis port").default(6379),
    REDIS_HOST: Joi.string().description("Redis host"),
    CLIENT_URL: Joi.string().description("The URL of the client app"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      service: envVars.SMTP_SERVICE,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  redis: {
    url: envVars.REDIS_URL,
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  },
  clientUrl: envVars.CLIENT_URL,
};

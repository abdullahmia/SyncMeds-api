import dotenv from "dotenv";
import Joi from "joi";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), `.env`) });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development").required(),
    PORT: Joi.number().default(8000),

    // Development Environment Variables
    DEVELOPMENT_DATABASE_URL: Joi.string()
      .when("NODE_ENV", {
        is: "development",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Development Postgres database url"),
    DEVELOPMENT_JWT_SECRET: Joi.string()
      .when("NODE_ENV", {
        is: "development",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Development JWT secret key"),
    DEVELOPMENT_JWT_ACCESS_EXPIRATION_MINUTES: Joi.string()
      .default("1h")
      .description("Development access token expiration"),
    DEVELOPMENT_JWT_REFRESH_EXPIRATION_DAYS: Joi.string()
      .default("7d")
      .description("Development refresh token expiration"),
    DEVELOPMENT_JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Development reset password token expiration"),
    DEVELOPMENT_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Development verify email token expiration"),
    DEVELOPMENT_SMTP_SERVICE: Joi.string().default("Gmail"),
    DEVELOPMENT_SMTP_USERNAME: Joi.string()
      .when("NODE_ENV", {
        is: "development",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Development email username"),
    DEVELOPMENT_SMTP_PASSWORD: Joi.string()
      .when("NODE_ENV", {
        is: "development",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Development email password"),
    DEVELOPMENT_EMAIL_FROM: Joi.string()
      .email()
      .when("NODE_ENV", {
        is: "development",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Development email from address"),
    DEVELOPMENT_REDIS_HOST: Joi.string().description("Development Redis host"),
    DEVELOPMENT_REDIS_PORT: Joi.number()
      .default(6379)
      .description("Development Redis port"),
    DEVELOPMENT_REDIS_USERNAME: Joi.string().allow(""),
    DEVELOPMENT_REDIS_PASSWORD: Joi.string().allow(""),
    DEVELOPMENT_CLIENT_URL: Joi.string()
      .uri()
      .when("NODE_ENV", {
        is: "development",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Development client URL"),

    // Production Environment Variables
    PRODUCTION_DATABASE_URL: Joi.string()
      .when("NODE_ENV", {
        is: "production",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Production Postgres database url"),
    PRODUCTION_JWT_SECRET: Joi.string()
      .when("NODE_ENV", {
        is: "production",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Production JWT secret key (min 64 chars)"),
    PRODUCTION_JWT_ACCESS_EXPIRATION_MINUTES: Joi.string()
      .default("15m")
      .description("Production access token expiration"),
    PRODUCTION_JWT_REFRESH_EXPIRATION_DAYS: Joi.string()
      .default("7d")
      .description("Production refresh token expiration"),
    PRODUCTION_JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Production reset password token expiration"),
    PRODUCTION_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Production verify email token expiration"),
    PRODUCTION_SMTP_SERVICE: Joi.string().default("Gmail"),
    PRODUCTION_SMTP_USERNAME: Joi.string()
      .when("NODE_ENV", {
        is: "production",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Production email username"),
    PRODUCTION_SMTP_PASSWORD: Joi.string()
      .when("NODE_ENV", {
        is: "production",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Production email password"),
    PRODUCTION_EMAIL_FROM: Joi.string()
      .email()
      .when("NODE_ENV", {
        is: "production",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Production email from address"),
    PRODUCTION_REDIS_HOST: Joi.string().description("Production Redis host"),
    PRODUCTION_REDIS_PORT: Joi.number()
      .default(6379)
      .description("Production Redis port"),
    PRODUCTION_REDIS_USERNAME: Joi.string().required(),
    PRODUCTION_REDIS_PASSWORD: Joi.string().required(),
    PRODUCTION_CLIENT_URL: Joi.string()
      .uri()
      .when("NODE_ENV", {
        is: "production",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .description("Production client URL"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  console.error(`❌ Config validation error:`);
  console.error(
    error.details.map((detail) => `  - ${detail.message}`).join("\n")
  );
  process.exit(1);
}

console.log("✓ Environment variables validated successfully");

const envs = {
  development: {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    databaseUrl: envVars.DEVELOPMENT_DATABASE_URL,
    jwt: {
      secret: envVars.DEVELOPMENT_JWT_SECRET,
      accessExpirationMinutes:
        envVars.DEVELOPMENT_JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: envVars.DEVELOPMENT_JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes:
        envVars.DEVELOPMENT_JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes:
        envVars.DEVELOPMENT_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
      smtp: {
        service: envVars.DEVELOPMENT_SMTP_SERVICE,
        auth: {
          user: envVars.DEVELOPMENT_SMTP_USERNAME,
          pass: envVars.DEVELOPMENT_SMTP_PASSWORD,
        },
      },
      from: envVars.DEVELOPMENT_EMAIL_FROM,
    },
    redis: {
      host: envVars.DEVELOPMENT_REDIS_HOST,
      port: envVars.DEVELOPMENT_REDIS_PORT,
      username: envVars.DEVELOPMENT_REDIS_USERNAME,
      password: envVars.DEVELOPMENT_REDIS_PASSWORD,
    },
    clientUrl: envVars.DEVELOPMENT_CLIENT_URL,
  },

  production: {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    databaseUrl: envVars.PRODUCTION_DATABASE_URL,
    jwt: {
      secret: envVars.PRODUCTION_JWT_SECRET,
      accessExpirationMinutes: envVars.PRODUCTION_JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: envVars.PRODUCTION_JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes:
        envVars.PRODUCTION_JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes:
        envVars.PRODUCTION_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
      smtp: {
        service: envVars.PRODUCTION_SMTP_SERVICE,
        auth: {
          user: envVars.PRODUCTION_SMTP_USERNAME,
          pass: envVars.PRODUCTION_SMTP_PASSWORD,
        },
      },
      from: envVars.PRODUCTION_EMAIL_FROM,
    },
    redis: {
      host: envVars.PRODUCTION_REDIS_HOST,
      port: envVars.PRODUCTION_REDIS_PORT,
      username: envVars.PRODUCTION_REDIS_USERNAME,
      password: envVars.PRODUCTION_REDIS_PASSWORD,
    },
    clientUrl: envVars.PRODUCTION_CLIENT_URL,
  },
};

// Validate that we have a valid environment configuration
const currentEnv = envVars.NODE_ENV as keyof typeof envs;
if (!envs[currentEnv]) {
  console.error(`❌ Unknown environment: ${envVars.NODE_ENV}`);
  process.exit(1);
}

console.log(`✓ Loaded configuration for: ${currentEnv.toUpperCase()}`);

export default envs[currentEnv];

import { UserPayload } from "@/modules/user/user.types";
import { ApiError } from "@/shared/utils/api-error.util";
import { logger } from "@/shared/utils/logger.util";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import passport from "passport";

declare global {
  namespace Express {
    interface User extends UserPayload {}
  }
}

export class AuthMiddleware {
  /**
   * JWT Authentication middleware
   */
  static authenticateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: UserPayload, info: any): void => {
        if (err) {
          return next(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Authentication service unavailable"
            )
          );
        }

        if (!user) {
          const message = info?.message || "Invalid or expired token";
          return next(new ApiError(httpStatus.UNAUTHORIZED, message));
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  };

  /**
   * Local Authentication middleware for login
   */
  static authenticateLocal = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: UserPayload, info: any): void => {
        if (err) {
          logger.error("Local Authentication error:", err);
          return next(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Authentication service unavailable"
            )
          );
        }

        if (!user) {
          const message = info?.message || "Invalid credentials";
          return next(new ApiError(httpStatus.UNAUTHORIZED, message));
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  };

  /**
   * Optional authentication - doesn't fail if no token provided
   */
  static optionalAuth = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: UserPayload): void => {
        if (err) {
          logger.error("Optional Auth error:", err);
        }

        if (user) {
          req.user = user;
        }

        next();
      }
    )(req, res, next);
  };
}

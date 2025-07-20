import { UserPayload } from "@/modules/user/user.types";
import { NextFunction, Request, Response } from "express";
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
          console.error("JWT Authentication error:", err);
          res.status(500).json({
            error: "Internal authentication error",
            message: "Authentication service unavailable",
          });
          return;
        }

        if (!user) {
          res.status(401).json({
            error: "Unauthorized",
            message: info?.message || "Invalid or expired token",
          });
          return;
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
          console.error("Local Authentication error:", err);
          res.status(500).json({
            error: "Internal authentication error",
            message: "Authentication service unavailable",
          });
          return;
        }

        if (!user) {
          res.status(401).json({
            error: "Authentication failed",
            message: info?.message || "Invalid credentials",
          });
          return;
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
          console.error("Optional Auth error:", err);
        }

        if (user) {
          req.user = user;
        }

        next();
      }
    )(req, res, next);
  };
}

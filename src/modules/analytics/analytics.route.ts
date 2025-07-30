import { AuthMiddleware } from "@/core/middleware/auth.middleware";
import { Router } from "express";
import * as analyticsController from "./analytics.controller";

const router: Router = Router();

router.get(
  "/summary",
  AuthMiddleware.authenticateJWT,
  analyticsController.getSummary
);
router.get(
  "/sales-trend",
  AuthMiddleware.authenticateJWT,
  analyticsController.getSalesTrend
);
router.get(
  "/recent-sales",
  AuthMiddleware.authenticateJWT,
  analyticsController.getRecentSales
);

export { router as analyticsRouter };

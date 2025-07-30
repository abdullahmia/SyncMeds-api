import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as analyticsService from "./analytics.service";

export const getSummary = async (req: Request, res: Response) => {
  const data = await analyticsService.getDashboardStats();
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Dashboard Summary", data));
};

export const getSalesTrend = async (req: Request, res: Response) => {
  const trend = await analyticsService.getSalesTrend();
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Sales Trend", trend));
};

export const getRecentSales = async (req: Request, res: Response) => {
  const recentSales = await analyticsService.getRecentSales();
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Recent Sales", recentSales));
};

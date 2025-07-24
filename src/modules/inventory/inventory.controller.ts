import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as inventoryService from "./inventory.service";

export const getAllInventory = async (req: Request, res: Response) => {
  const result = await inventoryService.getAllInventories(req.query);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Inventory list", result));
};

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

export const getInventory = async (req: Request, res: Response) => {
  const inventory = await inventoryService.getInventoryById(req.params.id);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Inventory fetch successful", inventory));
};

export const addInventory = async (req: Request, res: Response) => {
  const inventory = await inventoryService.addInventory(req.body);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.CREATED, "Inventory has been added", inventory));
};

export const deleteInventoryId = async (req: Request, res: Response) => {
  const inventory = await inventoryService.deleteInventory(req.params.id);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Inventory has been deleted", inventory));
};

export const getInventorySummary = async (req: Request, res: Response) => {
  const summary = await inventoryService.getSummaries();
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Inventory summary", summary));
};

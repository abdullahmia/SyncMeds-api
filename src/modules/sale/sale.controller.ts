import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as saleService from "./sale.service";

export const addSale = async (req: Request, res: Response) => {
  const sale = await saleService.addSale(req.body);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.CREATED, "Sale has been added", sale));
};

export const getAllSales = async (req: Request, res: Response) => {
  const sales = await saleService.getAllSaleHistory(req.query);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Sale list", sales));
};

export const deleteSale = async (req: Request, res: Response) => {
  const sale = await saleService.deleteSaleById(req.params.id);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Sale deleted successfully", sale));
};

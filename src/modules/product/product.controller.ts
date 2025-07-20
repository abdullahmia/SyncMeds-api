import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as productService from "./product.service";

export const getAllProduct = async (req: Request, res: Response) => {
  const products = await productService.getAllProducts(req.query);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Product retrieve successful", products));
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Product retrieve successful", product));
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.CREATED, "Product has been added", product));
};

export const updateProductById = async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.CREATED, "Product has been updated", product));
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await productService.deleteProduct(req.params.id);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.CREATED, "Product has been deleted", product));
};

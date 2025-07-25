import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as customerService from "./customer.service";

export const getAllCustomer = async (req: Request, res: Response) => {
  const customers = await customerService.getAllCustomers(req.query);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Customer list", customers));
};

export const getCustomerById = async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById(req.params.id);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Customer details", customer));
};

export const createCustomer = async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.CREATED, "Customer has been added", customer));
};

export const updateCustomerById = async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomerById(
    req.params.id,
    req.body
  );
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Customer has been updated", customer));
};

export const deleteCustomerById = async (req: Request, res: Response) => {
  const customer = await customerService.deleteCustomerById(req.params.id);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Customer has been deleted", customer));
};

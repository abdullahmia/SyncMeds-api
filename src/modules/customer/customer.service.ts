import { Customer } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import { UpdateUserPayload } from "../user/user.types";
import * as customerRepository from "./customer.repository";
import {
  CreateCustomerPayload,
  CustomerQuery,
  CustomerQueryResponse,
} from "./customer.types";

export const getAllCustomers = async (
  query: CustomerQuery
): Promise<CustomerQueryResponse> => {
  return await customerRepository.getAll({
    search: query.search,
    order: query.order?.toLocaleLowerCase(),
    order_by: query.order_by?.toLocaleLowerCase(),
    page: query.page ? parseInt(String(query.page), 10) : 1,
    limit: query.limit ? parseInt(String(query.limit), 10) : 10,
  });
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const inventory = await customerRepository.byId(id);

  if (!inventory)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Customer is not with found with this ${id}`
    );

  return inventory;
};

export const createCustomer = async (
  payload: CreateCustomerPayload
): Promise<Customer> => {
  return await customerRepository.create(payload);
};

export const updateCustomerById = async (
  customerId: string,
  payload: UpdateUserPayload
): Promise<Customer> => {
  return await customerRepository.update(customerId, payload);
};

export const deleteCustomerById = async (
  customer_id: string
): Promise<Customer> => {
  return await customerRepository.deleteCustomer(customer_id);
};

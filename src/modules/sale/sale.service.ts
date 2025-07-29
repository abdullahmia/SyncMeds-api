import { Sale } from "@/generated/prisma";
import { customerService } from "@/modules/customer";
import { inventoryService } from "@/modules/inventory";
import { userService } from "@/modules/user";
import * as saleRepository from "./sale.repository";
import { CreateSalePayload, SaleQuery, SalesResponse } from "./sale.types";

export const addSale = async (payload: CreateSalePayload): Promise<Sale> => {
  const { customer_id, user_id, items } = payload;

  await Promise.all([
    customerService.getCustomerById(customer_id),
    userService.getUserById(user_id),
  ]);

  // validate all product are exist
  await Promise.all(
    items.map((item) => inventoryService.getInventoryById(item.inventory_id))
  );

  const sale = await saleRepository.create(payload);

  if (sale) {
    // TODO: Add a event emitter to handle post-sale actions
  }

  return sale;
};

export const getAllSaleHistory = async (
  query: SaleQuery
): Promise<SalesResponse> => {
  return saleRepository.getAll({
    page: query.page ? parseInt(String(query.page), 10) : 1,
    limit: query.limit ? parseInt(String(query.limit), 10) : 10,
    ...query,
  });
};

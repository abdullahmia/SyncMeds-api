import { Inventory } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import * as inventoryRepository from "./inventory.repository";
import {
  AddInventoryPayload,
  InventoryQuery,
  InventoryQueryResponse,
} from "./inventory.types";

export const getAllInventories = async (
  query: InventoryQuery
): Promise<InventoryQueryResponse> => {
  return await inventoryRepository.getInventories({
    search: query.search,
    status: query.status,
    order: query.order?.toLowerCase(),
    order_by: query.order_by?.toLowerCase(),
    page: query.page ? parseInt(String(query.page), 10) : 1,
    limit: query.limit ? parseInt(String(query.limit), 10) : 10,
  });
};

export const getInventoryById = async (id: string): Promise<Inventory> => {
  const inventory = await inventoryRepository.byId(id);

  if (!inventory)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Inventory is not with found with this ${id}`
    );

  return inventory;
};

export const addInventory = async (
  payload: AddInventoryPayload
): Promise<Inventory> => {
  return await inventoryRepository.add(payload);
};

export const deleteInventory = async (id: string): Promise<Inventory> => {
  return await inventoryRepository.deleteById(id);
};

export const updateInventoryOnSale = async (
  saleId: string
): Promise<Inventory[]> => {
  return await inventoryRepository.updateInventoryOnSale(saleId);
};

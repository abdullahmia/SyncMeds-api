import * as inventoryRepository from "./inventory.repository";
import { InventoryQuery, InventoryQueryResponse } from "./inventory.types";

export const getAllInventories = async (
  query: InventoryQuery
): Promise<InventoryQueryResponse> => {
  return await inventoryRepository.getInventories({
    search: query.search,
    status: query.status,
    order: query.order,
    order_by: query.order_by,
    page: query.page ? parseInt(String(query.page), 10) : 1,
    limit: query.limit ? parseInt(String(query.limit), 10) : 10,
  });
  // return {
  //   data: [],
  //   meta: {
  //     page: 1,
  //     limit: 10,
  //     total: 2,
  //     totalPages: 1,
  //   },
  // };
};

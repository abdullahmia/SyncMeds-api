import { Inventory, InventoryStatus } from "@/generated/prisma";
import { PaginationMeta } from "@/shared/types";

export type InventoryQuery = {
  search?: string;
  page?: number;
  limit?: number;
  order_by?: string;
  order?: string;
  status?: InventoryStatus;
};

export type InventoryQueryResponse = {
  data: Inventory[];
  meta: PaginationMeta;
};

export type AddInventoryPayload = Omit<
  Inventory,
  "inventory_id" | "created_at" | "updated_at" | "status"
>;

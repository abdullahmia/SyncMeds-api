import { Customer } from "@/generated/prisma";
import { PaginationMeta } from "@/shared/types";

export type CustomerQuery = {
  search?: string;
  page?: number;
  limit?: number;
  order_by?: string;
  order?: string;
};

export type CustomerQueryResponse = {
  data: Customer[];
  meta: PaginationMeta;
};

export type CreateCustomerPayload = Omit<
  Customer,
  "customer_id" | "created_at" | "updated_at"
>;

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

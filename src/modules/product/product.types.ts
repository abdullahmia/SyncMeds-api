import { Product } from "@/generated/prisma";
import { PaginationMeta } from "@/shared/types";

export type CreateProductPayload = Omit<
  Product,
  "product_id" | "created_at" | "updated_at"
>;

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

export type ProductQueryResponse = {
  data: Product[];
  meta: PaginationMeta;
};

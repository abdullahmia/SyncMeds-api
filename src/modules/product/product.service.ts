import { Product } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import * as productRepository from "./product.repository";
import {
  CreateProductPayload,
  ProductQuery,
  ProductQueryResponse,
  UpdateProductPayload,
} from "./product.types";

export const getAllProducts = async (
  query: ProductQuery
): Promise<ProductQueryResponse> => {
  console.log(typeof query.page);
  console.log(typeof query.limit);

  return await productRepository.getProducts({
    search: query.search,
    page: query.page ? parseInt(String(query.page), 10) : 1,
    limit: query.limit ? parseInt(String(query.limit), 10) : 10,
  });
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const product = await productRepository.byId(id);

  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

  return product;
};

export const createProduct = async (
  payload: CreateProductPayload
): Promise<Product> => {
  return productRepository.create(payload);
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
): Promise<Product | null> => {
  return productRepository.update(id, payload);
};

export const deleteProduct = async (id: string): Promise<Product> => {
  return await productRepository.deleteProduct(id);
};

import { cacheService } from "@/core/cache/cache.service";
import { Product } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import { generateCacheKeys } from "@/shared/utils/cache-keys";
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
  const cacheKey = `products:${generateCacheKeys(query)}`;

  const cachedProducts = await cacheService.get<ProductQueryResponse>(cacheKey);

  if (cachedProducts) {
    return cachedProducts;
  }

  const products = await productRepository.getProducts({
    search: query.search,
    page: query.page ? parseInt(String(query.page), 10) : 1,
    limit: query.limit ? parseInt(String(query.limit), 10) : 10,
  });

  await cacheService.set(cacheKey, products, 3600);
  return products;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const cacheKey = `products:${id}`;

  const cachedProduct = await cacheService.get<Product>(cacheKey);
  if (cachedProduct) {
    return cachedProduct;
  }

  const product = await productRepository.byId(id);
  cacheService.set(cacheKey, product, 3600);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

  return product;
};

export const createProduct = async (
  payload: CreateProductPayload
): Promise<Product> => {
  const product = await productRepository.create(payload);
  cacheService.delPattern("products:*");
  return product;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
): Promise<Product | null> => {
  const updatedProduct = await productRepository.update(id, payload);
  cacheService.del(`products:${id}`);
  return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<Product> => {
  const deletedProduct = await productRepository.deleteProduct(id);
  cacheService.del(`products:${id}`);
  return deletedProduct;
};

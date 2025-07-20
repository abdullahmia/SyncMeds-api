import { db } from "@/core/database/prisma.client";
import { Prisma, Product } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import {
  CreateProductPayload,
  ProductQuery,
  ProductQueryResponse,
  UpdateProductPayload,
} from "./product.types";

const selectProductProperty = {
  product_id: true,
  product_name: true,
  generic_name: true,
  description: true,
  category: true,
  manufacturer: true,
  sku: true,
  selling_price: true,
  cost_price: true,
  required_prescription: true,
  track_exprires: true,
  created_at: true,
  updated_at: true,
};

export const getProducts = async ({
  search,
  page = 1,
  limit = 10,
}: ProductQuery): Promise<ProductQueryResponse> => {
  console.log(page, limit);

  try {
    const whereClause: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { sku: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              product_name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              generic_name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              category: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const total = await db.product.count({ where: whereClause });

    const products = await db.product.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
      select: selectProductProperty,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new ApiError(500, "Failed to fetch products");
  }
};

export const byId = async (id: string): Promise<Product | null> => {
  const product = await db.product.findFirst({
    where: {
      product_id: id,
    },
  });

  return product;
};

export const create = async (
  payload: CreateProductPayload
): Promise<Product> => {
  try {
    const product = await db.product.create({
      data: payload,
    });

    return product;
  } catch {
    throw new ApiError(500, "Failed to create product");
  }
};

export const update = async (
  id: string,
  payload: UpdateProductPayload
): Promise<Product | null> => {
  try {
    const product = await db.product.update({
      where: {
        product_id: id,
      },
      data: { ...payload },
      select: selectProductProperty,
    });
    return product;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Product not found");
      }
    }
    throw new ApiError(500, "Failed to update product");
  }
};

export const deleteProduct = async (id: string): Promise<Product> => {
  try {
    const user = await db.product.delete({
      where: { product_id: id },
      select: selectProductProperty,
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Product not found");
      }
    }
    throw new ApiError(500, "Failed to delete Product");
  }
};

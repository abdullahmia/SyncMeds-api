import { db } from "@/core/database/prisma.client";
import { Prisma } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import { InventoryQuery } from "./inventory.types";

export const getInventories = async ({
  search,
  status,
  page = 1,
  limit = 10,
  order_by = "created_at",
  order = "desc",
}: InventoryQuery) => {
  try {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.InventoryWhereInput = {
      AND: [
        status ? { status } : {},
        search
          ? {
              OR: [
                { batch_number: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
                {
                  product: {
                    OR: [
                      {
                        product_name: { contains: search, mode: "insensitive" },
                      },
                      {
                        generic_name: { contains: search, mode: "insensitive" },
                      },
                      { sku: { contains: search, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {},
      ],
    };

    const [inventories, totalCount] = await Promise.all([
      db.inventory.findMany({
        where: whereClause,
        include: {
          product: {
            select: {
              product_name: true,
              generic_name: true,
              sku: true,
              selling_price: true,
            },
          },
        },
        orderBy: {
          [order_by]: order,
        },
        skip,
        take: limit,
      }),
      db.inventory.count({ where: whereClause }),
    ]);

    return {
      data: inventories,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server error"
    );
  }
};

import { db } from "@/core/database/prisma.client";
import { Inventory, InventoryStatus, Prisma } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import { AddInventoryPayload, InventoryQuery } from "./inventory.types";

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

export const byId = async (id: string): Promise<Inventory | null> => {
  const inventory = await db.inventory.findFirst({
    where: { inventory_id: id },
    include: { product: true },
  });

  return inventory;
};

export const add = async (payload: AddInventoryPayload): Promise<Inventory> => {
  try {
    const inventory = await db.inventory.create({
      data: {
        ...payload,
        status:
          payload.quantity === 0
            ? InventoryStatus.OUT_OF_STOCK
            : payload.quantity <= payload.reorder_level
            ? InventoryStatus.LOW_STOCK
            : InventoryStatus.AVAILABLE,
      },
      include: { product: true },
    });

    return inventory;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ApiError(
          httpStatus.CONFLICT,
          `Inventory with batch number ${payload.batch_number} already exists`
        );
      }
      if (error.code === "P2003") {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `Invalid product id reference`
        );
      }
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create inventory item"
    );
  }
};

export const deleteById = async (id: string): Promise<Inventory> => {
  try {
    const inventory = await db.inventory.delete({
      where: { inventory_id: id },
      include: { product: true },
    });
    return inventory;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Inventory not found");
      }
    }
    throw new ApiError(500, "Failed to delete Inventory");
  }
};

export const reduceStockQty = async (
  id: string,
  quantity: number
): Promise<Inventory> => {
  try {
    const currentInventory = await db.inventory.findUnique({
      where: { inventory_id: id },
      select: { quantity: true, reorder_level: true },
    });

    if (!currentInventory) {
      throw new ApiError(404, "Inventory not found");
    }

    const newQuantity = currentInventory.quantity - quantity;

    // Determine status based on new quantity
    let status: InventoryStatus;
    if (newQuantity <= 0) {
      status = InventoryStatus.OUT_OF_STOCK;
    } else if (newQuantity <= currentInventory.reorder_level) {
      status = InventoryStatus.LOW_STOCK;
    } else {
      status = InventoryStatus.AVAILABLE;
    }

    return await db.inventory.update({
      where: { inventory_id: id },
      data: {
        quantity: newQuantity,
        status: status,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Inventory not found");
      }
    }
    throw new ApiError(500, "Failed to update inventory");
  }
};

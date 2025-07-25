import { db } from "@/core/database/prisma.client";
import { Customer, Prisma } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import {
  CreateCustomerPayload,
  CustomerQuery,
  CustomerQueryResponse,
  UpdateCustomerPayload,
} from "./customer.types";

export const getAll = async ({
  search,
  order_by = "created_at",
  order = "desc",
  page = 1,
  limit = 10,
}: CustomerQuery): Promise<CustomerQueryResponse> => {
  try {
    const skip = (page - 1) * limit;
    const whereClause: Prisma.CustomerWhereInput = search
      ? {
          OR: [
            {
              name: { contains: search, mode: "insensitive" },
            },
            {
              email: { contains: search, mode: "insensitive" },
            },
            {
              phone: { contains: search, mode: "insensitive" },
            },
          ],
        }
      : {};

    const [customers, totalCount] = await Promise.all([
      db.customer.findMany({
        where: whereClause,
        orderBy: {
          [order_by]: order,
        },
        skip,
        take: limit,
      }),
      db.customer.count({ where: whereClause }),
    ]);

    return {
      data: customers,
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

export const byId = async (id: string): Promise<Customer | null> => {
  const customer = await db.customer.findFirst({
    where: { customer_id: id },
  });

  return customer;
};

export const create = async (
  payload: CreateCustomerPayload
): Promise<Customer> => {
  try {
    const customer = await db.customer.create({
      data: payload,
    });

    return customer;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create inventory item"
    );
  }
};

export const update = async (
  customerId: string,
  payload: UpdateCustomerPayload
): Promise<Customer> => {
  try {
    const customer = await db.customer.update({
      where: {
        customer_id: customerId,
      },
      data: { ...payload },
    });
    return customer;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Customer not found");
      }
    }
    throw new ApiError(500, "Failed to update customer");
  }
};

export const deleteCustomer = async (id: string): Promise<Customer> => {
  try {
    const customer = await db.customer.delete({
      where: { customer_id: id },
    });
    return customer;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Customer not found");
      }
    }
    throw new ApiError(500, "Failed to delete customer");
  }
};

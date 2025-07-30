import { db } from "@/core/database/prisma.client";
import { Prisma, Sale } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import { formatCurrency } from "@/shared/utils/currency.util";
import { formatDate } from "@/shared/utils/date.util";
import httpStatus from "http-status";
import {
  CreateSalePayload,
  InvoiceData,
  SaleQuery,
  SalesResponse,
} from "./sale.types";

export const create = async (payload: CreateSalePayload): Promise<Sale> => {
  return await db.$transaction(async (tx) => {
    const inventoryItems = await tx.inventory.findMany({
      where: {
        inventory_id: {
          in: payload.items.map((item) => item.inventory_id),
        },
      },
      include: { product: true },
    });

    if (inventoryItems.length !== payload.items.length) {
      throw new Error("Some inventory items do not exist.");
    }

    let totalAmount: number = 0;
    const saleItemData = [];

    for (const requestItem of payload.items) {
      const inventoryItem = inventoryItems.find(
        (inv) => inv.inventory_id === requestItem.inventory_id
      );

      if (!inventoryItem) {
        throw new Error(
          `Inventory item with ID ${requestItem.inventory_id} not found.`
        );
      }

      if (inventoryItem.quantity < requestItem.quantity) {
        throw new Error(
          `Insufficient inventory! Available: ${inventoryItem.quantity}, Requested: ${requestItem.quantity}`
        );
      }

      const unitPrice = inventoryItem.product.selling_price || 0;
      const itemTotal = Number(unitPrice) * requestItem.quantity;
      totalAmount += itemTotal;

      saleItemData.push({
        inventory_id: requestItem.inventory_id,
        quantity: requestItem.quantity,
        unit_price: unitPrice,
        total_amount: itemTotal,
      });
    }

    const sale = await tx.sale.create({
      data: {
        customer_id: payload.customer_id,
        user_id: payload.user_id,
        invoice_number: payload.invoice_number,
        payment_method: payload.payment_method,
        payment_status: payload.payment_status,
        notes: payload.notes || "",
        total_amount: totalAmount,
        sale_item: {
          create: saleItemData,
        },
      },
    });

    return sale;
  });
};

export const getAll = async ({
  page = 1,
  limit = 10,
  order_by = "created_at",
  order = "DESC",
  search,
  startDate,
  endDate,
}: SaleQuery): Promise<SalesResponse> => {
  try {
    const whereClauses: Prisma.SaleWhereInput = {
      AND: [],
    };

    // date filtering
    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }

      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999); // set to end of the day
        dateFilter.lte = endDateObj;
      }

      (whereClauses.AND as Prisma.SaleWhereInput[]).push({
        sale_date: dateFilter,
      });
    }

    // search across all relevant fields
    if (search && search.trim()) {
      (whereClauses.AND as Prisma.SaleWhereInput[]).push({
        OR: [
          {
            invoice_number: {
              contains: search.trim(),
              mode: "insensitive",
            },
          },
          {
            customer: {
              phone: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
          },
          {
            sale_item: {
              some: {
                inventory: {
                  product: {
                    product_name: {
                      contains: search.trim(),
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
        ],
      });
    }

    // Remove empty AND array if no conditions
    if ((whereClauses.AND as Prisma.SaleWhereInput[]).length === 0) {
      delete whereClauses.AND;
    }

    const skip = (page - 1) * limit;

    const orderBy: Prisma.SaleOrderByWithRelationInput = {
      [order_by]: order.toLowerCase() as "asc" | "desc",
    };

    const total = await db.sale.count({
      where: whereClauses,
    });

    const sales = await db.sale.findMany({
      where: whereClauses,
      orderBy,
      skip,
      take: Number(limit),
      include: {
        customer: { select: { customer_id: true, name: true } },
        user: { select: { user_id: true, name: true } },
        sale_item: {
          select: {
            quantity: true,
            inventory: {
              select: {
                product: {
                  select: {
                    product_id: true,
                    product_name: true,
                    sku: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: sales,
      meta: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server error"
    );
  }
};

export const deleteSale = async (id: string): Promise<Sale> => {
  try {
    const sale = await db.sale.delete({
      where: { sale_id: id },
    });
    return sale;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Sale not found");
      }
    }
    throw new ApiError(500, "Failed to delete Sale");
  }
};

export const getInvoice = async (saleId: string): Promise<InvoiceData> => {
  const sale = await db.sale.findUnique({
    where: { sale_id: saleId },
    include: {
      customer: true,
      sale_item: {
        include: {
          inventory: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!sale) {
    throw new Error(`Sale with ID ${saleId} not found`);
  }

  return {
    invoiceNumber: sale.invoice_number,
    customerName: sale.customer.name,
    customerEmail: sale.customer.email,
    issueDate: formatDate(sale.sale_date),
    status: sale.payment_status === "PAID" ? "Paid" : "Unpaid",
    paymentMethod: sale.payment_method,
    items: sale.sale_item.map((item) => ({
      name: item.inventory.product.product_name,
      quantity: item.quantity,
      unitPrice: formatCurrency(Number(item.unit_price)),
      totalPrice: formatCurrency(Number(item.total_amount)),
    })),
    subtotal: formatCurrency(Number(sale.total_amount)),
    grandTotal: formatCurrency(Number(sale.total_amount) * 1.1),
    year: new Date().getFullYear(),
  };
};

import { db } from "@/core/database/prisma.client";
import { Sale } from "@/generated/prisma";
import { CreateSalePayload } from "./sale.types";

export const create = async (
  payload: CreateSalePayload,
  totalAmount: number
): Promise<Sale> => {
  return await db.$transaction(async (tx) => {
    return tx.sale.create({
      data: {
        inventory_id: payload.inventory_id,
        customer_id: payload.customer_id,
        user_id: payload.user_id,
        invoice_number: payload.invoice_number,
        payment_method: payload.payment_method,
        payment_status: payload.payment_status,
        notes: payload.notes || "",
        total_amount: totalAmount,
        SaleItem: {
          create: payload.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_amount: Number(item.unit_price) * item.quantity,
          })),
        },
      },
      include: {
        SaleItem: false,
      },
    });
  });
};

export const getAll = async (): Promise<Sale[]> => {
  return db.sale.findMany({
    include: {
      customer: {
        select: {
          customer_id: true,
          name: true,
        },
      },
      SaleItem: {
        select: {
          quantity: true,
          product: {
            select: {
              product_name: true,
              sku: true,
            },
          },
        },
      },
    },
  });
};

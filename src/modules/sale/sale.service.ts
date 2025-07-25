import { Sale } from "@/generated/prisma";
import { customerService } from "@/modules/customer";
import { inventoryService } from "@/modules/inventory";
import { productService } from "@/modules/product";
import { userService } from "@/modules/user";
import * as saleRepository from "./sale.repository";
import { CreateSalePayload } from "./sale.types";

export const addSale = async (payload: CreateSalePayload): Promise<Sale> => {
  const { inventory_id, customer_id, user_id, items } = payload;

  await Promise.all([
    inventoryService.getInventoryById(inventory_id),
    customerService.getCustomerById(customer_id),
    userService.getUserById(user_id),
  ]);

  // validate all product are exist
  await Promise.all(
    items.map((item) => productService.getProductById(item.product_id))
  );

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0
  );

  const sale = await saleRepository.create(payload, totalAmount);
  return sale;
};

export const getAllSaleHistory = async (): Promise<Sale[]> => {
  return saleRepository.getAll();
};

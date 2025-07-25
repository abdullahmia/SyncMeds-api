import { PaymentMethod, PaymentStatus } from "@/generated/prisma";

export type CreateSalePayload = {
  inventory_id: string;
  invoice_number: string;
  customer_id: string;
  user_id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes?: string | null;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
};

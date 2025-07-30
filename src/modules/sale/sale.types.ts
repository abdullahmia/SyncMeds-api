import { PaymentMethod, PaymentStatus, Sale } from "@/generated/prisma";

export type CreateSalePayload = {
  invoice_number: string;
  customer_id: string;
  user_id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes?: string | null;
  items: {
    inventory_id: string;
    quantity: number;
  }[];
};

export type SaleQuery = {
  search?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  limit?: number;
  order_by?: "sale_date" | "total_amount" | "invoice_number" | "created_at";
  order?: "ASC" | "DESC";
};

export type SalesResponse = {
  data: Sale[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  status: "Paid" | "Unpaid";
  paymentMethod: string;
  items: InvoiceItem[];
  subtotal: string;
  grandTotal: string;
  year: number;
}

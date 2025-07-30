export type SaleItem = {
  inventoryId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type SaleCreatedPayload = {
  saleId: string;
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  invoiceNumber: string;
};

// Add other sale-related event types as needed
export type SaleEventTypes = {
  "sale:created": SaleCreatedPayload;
};

export type UserEventTypes = {
  "user:created": { userId: string; name: string };
  "user:deleted": { userId: string };
};

export type AppEventTypes = SaleEventTypes & UserEventTypes;

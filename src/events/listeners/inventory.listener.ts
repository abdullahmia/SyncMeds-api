import { emailQueue, saleQueue } from "@/core/queue/queue.service";
import { Sale } from "@/generated/prisma";
import { customerService } from "@/modules/customer";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { eventBus } from "../event-bus";

export class InventoryListener {
  constructor() {
    eventBus.on("sale:created", this.onSaleCreated.bind(this));
  }

  async onSaleCreated(payload: Sale): Promise<void> {
    const { sale_id, customer_id } = payload;

    await saleQueue.add(QueueKeys.INVENTORY_UPDATE, sale_id);

    const customer = await customerService.getCustomerById(customer_id);

    if (!customer) throw new Error(`Customer with ID ${customer_id} not found`);

    await emailQueue.add(QueueKeys.SALE_INVOICE_PAYMENT, sale_id);
  }
}

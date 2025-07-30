import { saleQueue } from "@/core/queue/queue.service";
import { Sale } from "@/generated/prisma";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { eventBus } from "../event-bus";

export class InventoryListener {
  constructor() {
    eventBus.on("sale:created", this.onSaleCreated.bind(this));
  }

  async onSaleCreated(payload: Sale): Promise<void> {
    await saleQueue.add(QueueKeys.INVENTORY_UPDATE, payload.sale_id);
    // await inventoryService.updateInventoryOnSale(payload.sale_id);

    // Generate a invoice

    // Send email to the customer
  }
}

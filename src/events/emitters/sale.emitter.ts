import { eventBus } from "../event-bus";
import { SaleEventTypes } from "../types/sale-event.types";

export class SaleEmitter {
  static created(payload: SaleEventTypes["sale:created"]) {
    eventBus.emit("sale:created", {
      ...payload,
      eventId: crypto.randomUUID(),
      timestamp: new Date(),
    });
  }
}

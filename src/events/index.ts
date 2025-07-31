import { InventoryListener } from "./listeners/inventory.listener";

export const initEventListeners = () => {
  new InventoryListener();
};

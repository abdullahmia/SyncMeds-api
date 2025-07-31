import { EventEmitter } from "node:events";

class AppEventEmitter extends EventEmitter {
  private static instance: AppEventEmitter;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  public static getInstance(): AppEventEmitter {
    if (!AppEventEmitter.instance) {
      AppEventEmitter.instance = new AppEventEmitter();
    }

    return AppEventEmitter.instance;
  }
}

export const eventBus = AppEventEmitter.getInstance();

import EventEmitter from "events";

class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20);
  }
}

export const eventBus = new AppEventEmitter();

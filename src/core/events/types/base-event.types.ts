export type BaseEventPayload = {
  eventId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
};

export type EventHandler<T extends BaseEventPayload> = (
  payload: T
) => Promise<void>;

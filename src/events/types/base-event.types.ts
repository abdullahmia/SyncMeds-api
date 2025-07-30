export type EventHandler<T> = (payload: T) => Promise<void>;

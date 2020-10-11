export type Append<TEvent> = (event: TEvent) => Promise<void>;

export type FetchAll<TEvent> = () => Promise<TEvent[]>;

export type EventStoreApi<TEvent> = {
  append: Append<TEvent>;
  fetchAll: FetchAll<TEvent>;
};

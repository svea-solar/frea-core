export type RowData<TEvent> = {
  id: number;
  uuid: string;
  event: TEvent;
  insertedAt: string;
};

export type Append<TEvent> = (event: TEvent) => Promise<void>;

export type FetchAll<TEvent> = () => Promise<RowData<TEvent>[]>;

export type FetchById<TEvent> = (uuid: string) => Promise<RowData<TEvent>[]>;

export type EventStoreApi<TEvent> = {
  append: Append<TEvent>;
  fetchAll: FetchAll<TEvent>;
  fetchById: FetchById<TEvent>;
};

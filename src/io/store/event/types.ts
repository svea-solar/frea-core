export type RowData<TEvent> = {
  id: number;
  event: TEvent;
  insertedAt: string;
};

export type Append<TEvent> = (event: TEvent) => Promise<void>;

export type FetchAll<TEvent> = () => Promise<RowData<TEvent>[]>;

export type FetchByUuid<TEvent> = (uuid: string) => Promise<RowData<TEvent>[]>;

export type EventStoreApi<TEvent> = {
  append: Append<TEvent>;
  fetchAll: FetchAll<TEvent>;
  fetchByUuid: FetchByUuid<TEvent>;
};

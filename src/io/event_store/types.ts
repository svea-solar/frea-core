import { CacheStore } from "./cache";
import { EventStoreApi } from "./event";

export type Store<TEvent> = {
  cache: CacheStore;
  event: EventStoreApi<TEvent>;
};

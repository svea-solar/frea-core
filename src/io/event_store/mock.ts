import { EventStoreApi } from "./types";

type Create = <TEvent>() => EventStoreApi<TEvent>;

export const createEventStoreMock: Create = () => {
  const store: any[] = [];

  return {
    append: (event) => {
      store.push(event);
      return Promise.resolve();
    },
    fetchAll: () => Promise.resolve(store),
    fetchByUuid: () => Promise.reject("Not implemented."),
  };
};

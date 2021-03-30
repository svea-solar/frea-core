import { Result } from "../../..";

export type UpdateOk = void;

export type UpdateErr =
  | { code: "io/event_store.update->failed:unknown" }
  | { code: "io/event_store.update->failed:item_not_found"; args: any };

export type Update = (args: {
  idKey: string;
  idVal: string;
  event: any;
  reducer: (state: any, event: any) => any;
}) => Result<UpdateOk, UpdateErr>;

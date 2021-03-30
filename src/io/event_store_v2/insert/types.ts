import { Result } from "../../../";

export type InsertOk = void;

export type InsertErr =
  | { code: "io/event_store.insert->failed:unknown"; innerError: any }
  | { code: "io/event_store.insert->failed:item_already_exist"; item: any };

export type Insert = (args: {
  idKey: string;
  idVal: string;
  event: any;
  state: any;
}) => Result<InsertOk, InsertErr>;

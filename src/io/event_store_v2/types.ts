import { Result } from "../..";
import { GetBy } from "./get_by";
import { Insert } from "./insert";

export type UpdateData = void;

export type UpdateError =
  | { code: "io/event_store.update->failed:unknown" }
  | { code: "io/event_store.update->failed:item_not_found"; args: any };

export type Update = (args: {
  idKey: string;
  idVal: string;
  event: any;
  reducer: (state: any, event: any) => any;
}) => Result<UpdateData, UpdateError>;

export type Store = {
  getBy: GetBy;
  insert: Insert;
  update: Update;
};

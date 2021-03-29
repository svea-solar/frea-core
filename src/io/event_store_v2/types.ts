import { Result } from "../..";

export type GetByError =
  | {
      code: "io/event_store.get_by->failed:unknown";
    }
  | { code: "io/event_store.get_by->failed:item_not_found"; args: any };

export type GetBy = (
  idKey: string,
  idVal: string
) => Result<{ [k: string]: any }, GetByError>;

export type CreateData = void;

export type CreateError =
  | { code: "io/event_store.create->failed:unknown" }
  | { code: "io/event_store.create->failed:item_already_exist"; item: any };

export type Insert = (args: {
  idKey: string;
  idVal: string;
  event: any;
  state: any;
}) => Result<CreateData, CreateError>;

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

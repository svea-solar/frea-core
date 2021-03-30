import { Result } from "../../..";

export type GetByErr =
  | {
      code: "io/event_store.get_by->failed:unknown";
    }
  | { code: "io/event_store.get_by->failed:item_not_found"; args: any };

export type GetBy = (
  idKey: string,
  idVal: string
) => Result<{ [k: string]: any }, GetByErr>;

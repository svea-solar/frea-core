import { GetBy } from "./get_by";
import { Insert } from "./insert";
import { Update } from "./update";

export type Store = {
  getBy: GetBy;
  insert: Insert;
  update: Update;
};

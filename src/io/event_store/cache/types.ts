import { Result } from "../../../types";

export type InsertData = void;

export type InsertError = {
  code: "unknown" | "cache_item_already_exists";
};

export type Insert = (args: { data: any }) => Result<InsertData, InsertError>;

export type GetData = {
  // TODO: make it a generic.
  data: any;
  uuid: string;
  updatedAt: string;
};

export type GetError = {
  code: "unknown" | "cache_item_not_found";
};

export type Get = (args: { uuid: string }) => Result<GetData, GetError>;

export type UpdateData = void;

export type UpdateError = { code: "unknown" };

export type Update = (args: { data: any }) => Result<UpdateData, UpdateError>;

export type CacheStore = {
  insert: Insert;
  get: Get;
  update: Update;
};

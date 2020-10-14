import { ApiResult } from "../../../types";

export type InsertData = void;

export type InsertError = {
  reason: "unknown";
};

export type Insert = (args: {
  data: any;
}) => ApiResult<InsertData, InsertError>;

export type GetData = {
  // TODO: make it a generic.
  data: any;
  uuid: string;
  updatedAt: string;
};

export type GetError = {
  reason: "unknown" | "cache_item_not_found";
};

export type Get = (args: { uuid: string }) => ApiResult<GetData, GetError>;

export type UpdateData = void;

export type UpdateError = { reason: "unknown" };

export type Update = (args: {
  data: any;
}) => ApiResult<UpdateData, UpdateError>;

export type CacheStore = {
  insert: Insert;
  get: Get;
  update: Update;
};

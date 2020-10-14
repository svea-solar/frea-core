import { ApiResult } from "../../../types";

export type InsertData = void;

export type InsertError = {
  reason: "unknown";
};

export type Insert = () => ApiResult<InsertData, InsertError>;

export type GetData = {
  // TODO: make it a generic.
  event: any;
  id: string;
  insertedAt: string;
};

export type GetError = {
  reason: "unknown";
};

export type Get = () => ApiResult<GetData, GetError>;

export type UpdateData = void;

export type UpdateError = { reason: "unknown" };

export type Update = () => ApiResult<UpdateData, UpdateError>;

export type CacheStore = {
  insert: Insert;
  get: Get;
  update: Update;
};

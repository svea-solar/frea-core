import { ApiResult } from "../../../types";

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

export type CacheStore = {
  get: Get;
};

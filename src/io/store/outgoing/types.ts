import { ApiResult } from "../../../types";

export type AddData = void;

export type AddError = { reason: "unknown" };

export type Add = () => ApiResult<AddData, AddError>;

export type GetData = {
  // TODO: make it a generic.
  event: any;
  id: string;
  insertedAt: string;
};

export type GetError = {
  reason: "unknown";
};

export type RemoveData = void;

export type RemoveError = {
  reason: "unknown";
};

export type Remove = () => ApiResult<RemoveData, RemoveError>;

export type Get = () => ApiResult<GetData, GetError>;

export type OutgoingStore = {
  add: Add;
  get: Get;
  remove: Remove;
};

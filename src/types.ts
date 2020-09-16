// Deprecated
export type Ok<T> = T extends void
  ? { status: "succeeded" }
  : {
      status: "succeeded";
      data: T;
    };

// Deprecated
export type BaseErr = { reason: string };

// Deprecated
export type Err<E extends BaseErr> = {
  status: "failed";
  error: E;
};

// Deprecated
export type Result<T, E extends BaseErr> = Promise<Ok<T> | Err<E>>;

export type ApiOk<T> = T extends void ? { ok: true } : { ok: true; data: T };

export type ApiErr<E extends { reason: string }> = {
  ok: false;
  error: E;
};

export type ApiResult<T, E extends { reason: string }> = Promise<
  ApiOk<T> | ApiErr<E>
>;

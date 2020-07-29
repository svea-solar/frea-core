export type Ok<T> = T extends void
  ? { status: "succeeded" }
  : {
      status: "succeeded";
      data: T;
    };

export type BaseErr = { reason: string };

export type Err<E extends BaseErr> = {
  status: "failed";
  error: E;
};

export type Result<T, E extends BaseErr> = Promise<Ok<T> | Err<E>>;

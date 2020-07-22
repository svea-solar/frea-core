export type Ok<T> = {
  status: "succeeded";
  data: T;
};

export type Err<E> = {
  status: "failed";
  reason: "invalid_message" | "not_authorized" | "unknown";
  errors: E[];
};

export type Result<T, E> = Promise<Ok<T> | Err<E>>;

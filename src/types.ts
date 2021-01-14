export type Ok<T> = T extends void ? { ok: true } : { ok: true; data: T };

export type Err<E extends { code: string }> = {
  ok: false;
  error: E;
};

export type Result<T, E extends { code: string }> = Promise<Ok<T> | Err<E>>;

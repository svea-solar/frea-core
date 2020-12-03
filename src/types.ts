export type Ok<T> = T extends void ? { ok: true } : { ok: true; data: T };

export type Err<E extends { code: string }> = {
  ok: false;
  error: E;
};

export type Result<T, E extends { code: string }> = Promise<Ok<T> | Err<E>>;

/**
 * @deprecated
 */
export type ApiOk<T> = T extends void ? { ok: true } : { ok: true; data: T };

/**
 * @deprecated
 */
export type ApiErr<E extends { reason: string }> = {
  ok: false;
  error: E;
};

/**
 * @deprecated
 */
export type ApiResult<T, E extends { reason: string }> = Promise<
  ApiOk<T> | ApiErr<E>
>;

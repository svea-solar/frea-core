export type ApiOk<T> = T extends void ? { ok: true } : { ok: true; data: T };

export type ApiErr<E extends { reason: string }> = {
  ok: false;
  error: E;
};

export type ApiResult<T, E extends { reason: string }> = Promise<
  ApiOk<T> | ApiErr<E>
>;

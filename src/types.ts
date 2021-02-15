export type Ok<T> = T extends void ? { ok: true } : { ok: true; data: T };

export type Err<E extends { code: string; innerError?: Error }> = {
  ok: false;
  error: E;
};

export type Result<T, E extends { code: string; innerError?: Error }> = Promise<
  Ok<T> | Err<E>
>;

export type Severity = "info" | "error";

export type Log = (args: {
  mod: string;
  type: string;
  severity: Severity;
  traceId?: string;
  result: unknown;
  clientCid?: string;
  args: unknown;
  meta?: unknown;
}) => void;

export type ActionArgsSchema<
  TAction extends (args: any, ctx: any) => Result<any, any>
> = TAction extends (args: infer TArgs, ctx: any) => Result<any, any>
  ? (keyof TArgs)[]
  : never;

export type Ctx = {
  type: string;
  token: any;
  clientCid?: string;
  clientIp?: string;
};

export type Mod = {
  [k: string]: (args: any, ctx: Ctx) => Result<any, any>;
};

export type ActionsSchema<TApi extends Mod> = {
  [K in keyof TApi]: {
    args: ActionArgsSchema<TApi[K]>;
    public?: true;
    log?: string[];
  };
};

export type ModuleSchema<TApi extends Mod> = {
  module: string;
  actions: ActionsSchema<TApi>;
};

export type ActionSchema = {
  args: string[];
};

import { Result } from "../../types";

export type Severity = "info" | "error";

export type Log = (args: {
  mod: string;
  type: string;
  severity: Severity;
  traceId?: string;
  result: unknown;
  clientCid?: string;
  args: unknown;
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
  };
};

export type ModuleSchema<TApi extends Mod> = {
  module: string;
  actions: ActionsSchema<TApi>;
};

export type ActionSchema = {
  args: string[];
};

export type Listen = () => Promise<void>;

export type Close = () => Promise<void>;

export type AddModule = <TApi extends Mod>(
  moduleSchema: ModuleSchema<TApi>,
  api: TApi
) => void;

export type GetApi = () => ModuleSchema<Mod>[];

export type HttpMod = {
  listen: Listen;
  close: Close;
  addModule: AddModule;
  getApi: GetApi;
};

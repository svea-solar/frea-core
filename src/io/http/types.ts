import { Mod, ModuleSchema } from "../..";

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

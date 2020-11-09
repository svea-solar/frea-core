import { JwtAdapter } from "adapters";
import { createMod } from "./mod";
import { HttpMod, Log } from "./types";
export * from "./types";

export const createHttpIo = <TToken>({
  jwt,
  port,
  corsList,
  log
}: {
  jwt: JwtAdapter<TToken>;
  port: string;
  corsList: string[];
  log:Log
}): HttpMod => {
  return createMod({ port, corsList, jwt,log });
};

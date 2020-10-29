import { JwtAdapter } from "adapters";
import { createMod } from "./mod";
import { HttpMod } from "./types";
export * from "./types";

export const createHttpIo = <TToken>({
  jwt,
  port,
  corsList,
}: {
  jwt: JwtAdapter<TToken>;
  port: string;
  corsList: string[];
}): HttpMod => {
  return createMod({ port, corsList, jwt });
};

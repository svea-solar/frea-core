import { JwtAdapter } from "adapters";
import { getEnv } from "../../get_env";
import { createMod } from "./mod";
import { HttpMod } from "./types";
export * from "./types";

export const createHttpIo = <TToken>({
  jwt,
}: {
  jwt: JwtAdapter<TToken>;
}): Promise<HttpMod> => {
  const port = getEnv("HTTP_DRIVER_PORT");
  const corsList = getEnv("HTTP_DRIVER_CORS_LIST").split(",");

  return createMod({ port, corsList, jwt });
};

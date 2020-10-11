import { getEnv } from "../../get_env";
import { createApi } from "./api";
import { HttpApi } from "./types";
export * from "./types";

type Create = () => Promise<HttpApi>;

export const createHttp: Create = () => {
  const port = getEnv("HTTP_DRIVER_PORT");
  const corsList = getEnv("HTTP_DRIVER_CORS_LIST").split(",");

  const api = createApi({ port, corsList });

  return api;
};

import { getEnv } from "../../get_env";
import { createApi } from "./api";
export * from "./types";

export const create = () => {
  const port = getEnv("HTTP_DRIVER_PORT");
  const corsList = getEnv("HTTP_DRIVER_CORS_LIST").split(",");

  const api = createApi({ port, corsList });

  return api;
};

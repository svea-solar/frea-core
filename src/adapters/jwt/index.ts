import { JwtAdapter } from "./types";
import { createApi } from "./mod";
import { getEnv } from "../../";
export * from "./types";

type Create = () => JwtAdapter;

export const createJwtAdapter: Create = () => {
  const secret = getEnv("JWT_ADAPTER_SECRET");
  return createApi({ secret });
};

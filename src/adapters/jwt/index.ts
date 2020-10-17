import { JwtAdapter } from "./types";
import { createMod } from "./mod";
export * from "./types";

export const createJwtAdapter = <T>({
  jwtSecret,
}: {
  jwtSecret: string;
}): JwtAdapter<T> => {
  return createMod({ jwtSecret });
};

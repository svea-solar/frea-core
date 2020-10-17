import { JwtAdapter } from "./types";
import { createMod } from "./mod";
export * from "./types";

type Create = (args: { jwtSecret: string }) => JwtAdapter;

export const createJwtAdapter: Create = ({ jwtSecret }) => {
  return createMod({ jwtSecret });
};

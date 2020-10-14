import { Get, CacheStore } from "./types";

type Create = () => CacheStore;

export const createMod: Create = () => {
  const get: Get = async () => {
    return {
      ok: false,
      error: {
        reason: "unknown",
      },
    };
  };

  return {
    get,
  };
};

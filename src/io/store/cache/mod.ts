import { Get, CacheStore, Insert, Update } from "./types";

type Create = () => CacheStore;

export const createMod: Create = () => {
  const insert: Insert = async () => {
    return {
      ok: false,
      error: {
        reason: "unknown",
      },
    };
  };

  const get: Get = async () => {
    return {
      ok: false,
      error: {
        reason: "unknown",
      },
    };
  };

  const update: Update = async () => {
    return {
      ok: false,
      error: {
        reason: "unknown",
      },
    };
  };

  return {
    insert,
    get,
    update,
  };
};

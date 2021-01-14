import { Add, Get, OutgoingStore, Remove } from "./types";

type Create = () => OutgoingStore;

export const createMod: Create = () => {
  const add: Add = async () => {
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

  const remove: Remove = async () => {
    return {
      ok: false,
      error: {
        reason: "unknown",
      },
    };
  };

  return {
    add,
    get,
    remove,
  };
};

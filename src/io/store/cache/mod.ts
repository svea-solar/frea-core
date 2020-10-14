import { IDatabase } from "pg-promise";
import { Get, CacheStore, Insert, Update } from "./types";

type DbRow = { data: any; uuid: string; updated_at: string };

type Create = (args: { module: string; db: IDatabase<unknown> }) => CacheStore;

export const createMod: Create = ({ module, db }) => {
  const insert: Insert = async ({ data }) => {
    await db.manyOrNone<DbRow>(
      /*sql*/ `INSERT INTO $<module:name>.cache
      (uuid, data)
      VALUES
      ($<uuid>, $<data>)`,
      {
        module,
        uuid: data.uuid,
        data,
      }
    );

    return { ok: true };
  };

  const get: Get = async ({ uuid }) => {
    const dbResult = await db.oneOrNone<DbRow>(
      /*sql*/ `SELECT * FROM $<module:name>.cache WHERE uuid = $<uuid>`,
      {
        module,
        uuid,
      }
    );

    if (!dbResult) {
      return { ok: false, error: { reason: "cache_item_not_found" } };
    }

    return {
      ok: true,
      data: {
        uuid: dbResult.uuid,
        data: dbResult.data,
        updatedAt: dbResult.updated_at,
      },
    };
  };

  const update: Update = async ({ data }) => {
    await db.manyOrNone<DbRow>(
      /*sql*/ `UPDATE $<module:name>.cache
      SET data = $<data>
      WHERE uuid = $<uuid>`,
      {
        module,
        uuid: data.uuid,
        data,
      }
    );

    return { ok: true };
  };

  return {
    insert,
    get,
    update,
  };
};

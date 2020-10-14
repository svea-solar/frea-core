import { IDatabase } from "pg-promise";
import { createMod } from "./mod";
import { CacheStore } from "./types";

export * from "./types";

type Create = (args: {
  module: string;
  db: IDatabase<unknown>;
}) => Promise<CacheStore>;

export const createCache: Create = async ({ module, db }) => {
  await db.none(
    /*sql*/ `CREATE TABLE IF NOT EXISTS $<module:name>.cache(
        "uuid" uuid PRIMARY KEY NOT NULL,
        "data" jsonb NOT NULL,
        "updated_at" timestamp(6) NOT NULL DEFAULT statement_timestamp()
      )`,
    {
      module,
    }
  );

  console.log(`Ensured that ${module} cache store exists.`);

  return createMod({ module, db });
};

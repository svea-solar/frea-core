import { getEnv } from "get_env";
import Pgp from "pg-promise";
import { createMod } from "./mod";
import { EventStoreApi } from "./types";
export * from "./types";
export * from "./mock";

type Create = <TEvent>(args: {
  module: string;
}) => Promise<EventStoreApi<TEvent>>;

let db: Pgp.IDatabase<{}>;

export const createEventStore: Create = async ({ module }) => {
  const dbUri = getEnv("DATABASE_URL");

  if (db === undefined) {
    db = Pgp()({
      connectionString: dbUri,
    });

    // Ensure DB connection.
    await db.query("select 1");

    console.log(`Event store DB connection is OK.`);
  }

  // Migrations
  await db.none(/*sql*/ `CREATE SCHEMA IF NOT EXISTS $<module:name>`, {
    module,
  });

  await db.none(
    /*sql*/ `CREATE TABLE IF NOT EXISTS $<module:name>.events(
    "id" serial PRIMARY KEY NOT NULL,
    "event" jsonb NOT NULL,
    "inserted_at" timestamp(6) NOT NULL DEFAULT statement_timestamp()
  )`,
    {
      module,
    }
  );

  console.log(`Event store ${module} migrated.`);

  return createMod({ db, module });
};

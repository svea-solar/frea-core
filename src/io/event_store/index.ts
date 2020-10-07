import Pgp from "pg-promise";
import { createMod } from "./mod";
import { EventStoreApi } from "./types";
export * from "./types";
export * from "./mod.mock";

type Create = <TEvent>(args: {
  schemaName: string;
}) => Promise<EventStoreApi<TEvent>>;

let db: Pgp.IDatabase<{}>;

export const createEventStore: Create = async ({ schemaName }) => {
  const dbUri = process.env.DATABASE_URL;

  if (!dbUri) {
    throw new Error("Missing DATABASE_URL.");
  }

  if (db === undefined) {
    db = Pgp()({
      // TODO: is this needed when run via Heroku?
      // ssl: { rejectUnauthorized: false },
      connectionString: dbUri,
    });
  }

  // Ensure DB connection.
  await db.query("select 1");

  console.log("event-store db connected.");

  // Migrations
  await db.none(/*sql*/ `CREATE SCHEMA IF NOT EXISTS $<name:name>`, {
    name: schemaName,
  });

  await db.none(/*sql*/ `CREATE EXTENSION IF NOT EXISTS pgcrypto`);

  await db.none(
    /*sql*/ `CREATE TABLE IF NOT EXISTS $<name:name>.events(
    "id" serial PRIMARY KEY NOT NULL,
    "uuid" uuid DEFAULT gen_random_uuid(),
    "type" text NOT NULL,
    "event" jsonb NOT NULL,
    "inserted_at" timestamp(6) NOT NULL DEFAULT statement_timestamp()
  )`,
    {
      name: `${schemaName}`,
    }
  );

  console.log("event-store db migrated.");

  return createMod({ db, schemaName });
};

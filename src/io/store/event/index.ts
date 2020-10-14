import { IDatabase } from "pg-promise";
import { createMod } from "./mod";
import { EventStoreApi } from "./types";
export * from "./types";
export * from "./mock";

type Create = <TEvent>(args: {
  module: string;
  db: IDatabase<unknown>;
}) => Promise<EventStoreApi<TEvent>>;

export const createEventStore: Create = async ({ module, db }) => {
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

  console.log(`Ensured that ${module} event store exists.`);

  return createMod({ db, module });
};

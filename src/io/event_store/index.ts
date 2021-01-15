import { createCache } from "./cache";
import { createEventStore } from "./event";
import Pgp from "pg-promise";
export * from "./types";
export * from "./event/types";

let db: Pgp.IDatabase<unknown>;

export const createStore = async <TEvent>({
  module,
  dbUri,
}: {
  module: string;
  dbUri: string;
}) => {
  if (db === undefined) {
    db = Pgp()({
      connectionString: dbUri,
    });

    // Ensure DB connection.
    await db.query("select 1");

    console.log(`Event store DB connection is OK.`);
  }

  await db.none(/*sql*/ `CREATE SCHEMA IF NOT EXISTS $<module:name>`, {
    module,
  });

  const event = await createEventStore<TEvent>({ module, db });
  const cache = await createCache({ module, db });

  return { event, cache, db };
};

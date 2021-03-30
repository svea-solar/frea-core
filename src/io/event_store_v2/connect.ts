import pgPromise from "pg-promise";

let db: pgPromise.IDatabase<unknown>;

export const connect = async (
  dbUri: string
): Promise<pgPromise.IDatabase<unknown>> => {
  if (db === undefined) {
    db = pgPromise()({
      connectionString: dbUri,
    });

    // Ensure DB connection.
    await db.query("select 1");

    console.log(`Event store DB connection is OK.`);
  }

  return db;
};

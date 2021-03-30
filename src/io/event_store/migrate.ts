import Pgp from "pg-promise";

export const migrate = async (
  db: Pgp.IDatabase<unknown>,
  name: string
): Promise<void> => {
  await db.none(/*sql*/ `CREATE SCHEMA IF NOT EXISTS $<name:name>`, {
    name,
  });

  await db.none(
    /*sql*/ `CREATE TABLE IF NOT EXISTS $<name:name>.events(
    "id" serial PRIMARY KEY NOT NULL,
    "event" jsonb NOT NULL,
    "inserted_at" timestamp(6) NOT NULL DEFAULT statement_timestamp()
  )`,
    {
      name,
    }
  );

  await db.none(
    /*sql*/ `CREATE TABLE IF NOT EXISTS $<name:name>.cache(
        "uuid" uuid PRIMARY KEY NOT NULL,
        "data" jsonb NOT NULL,
        "updated_at" timestamp(6) NOT NULL DEFAULT statement_timestamp()
      )`,
    {
      name,
    }
  );
};

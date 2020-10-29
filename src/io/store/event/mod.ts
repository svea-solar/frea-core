import { IDatabase } from "pg-promise";
import { EventStoreApi } from "./types";

type DbRow<TEvent> = {
  id: number;
  event: TEvent;
  inserted_at: string;
};

type Create = <TEvent>(args: {
  db: IDatabase<unknown>;
  module: string;
}) => EventStoreApi<TEvent>;

export const createMod: Create = ({ db, module }) => {
  return {
    append: (event) =>
      db
        .none(
          /*sql*/ `INSERT INTO $<module:name>.events
        (event)
        VALUES
        ($<event>)`,
          {
            module,
            event,
          }
        )
        .then(() => undefined),
    fetchAll: () =>
      db
        .manyOrNone<DbRow<any>>(
          /*sql*/ `SELECT * FROM $<module:name>.events ORDER BY id ASC`,
          {
            module,
          }
        )
        .then((dbRows) =>
          dbRows.map((dbRow) => ({
            id: dbRow.id,
            event: dbRow.event,
            insertedAt: dbRow.inserted_at,
          }))
        ),
        clearAll: () => db.none(/*sql*/ `DELETE * FROM $<module:name>.events`),
        fetchByUuid: (uuid) =>
      db
        .manyOrNone<DbRow<any>>(
          /*sql*/ `SELECT * FROM $<module:name>.events AS e WHERE e->>'uuid' = $<uuid> ORDER BY id ASC`,
          {
            module,
            uuid,
          }
        )
        .then((dbRows) =>
          dbRows.map((dbRow) => ({
            id: dbRow.id,
            event: dbRow.event,
            insertedAt: dbRow.inserted_at,
          }))
        ),
  };
};

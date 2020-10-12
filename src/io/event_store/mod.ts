import { IDatabase } from "pg-promise";
import { EventStoreApi } from "./types";

type DbRow<TEvent> = {
  id: number;
  uuid: string;
  type: string;
  event: TEvent;
  inserted_at: string;
};

type Create = <TEvent>(args: {
  db: IDatabase<unknown>;
  schemaName: string;
}) => EventStoreApi<TEvent>;

export const createMod: Create = ({ db, schemaName }) => {
  return {
    append: (event) =>
      db
        .none(
          /*sql*/ `INSERT INTO $<schemaName:name>.events
        (type, event)
        VALUES
        ($<event.type>, $<event>)`,
          {
            schemaName,
            event,
          }
        )
        .then(() => {}),
    fetchAll: () =>
      db
        .manyOrNone<DbRow<any>>(
          /*sql*/ `SELECT * FROM $<schemaName:name>.events ORDER BY inserted_at ASC`,
          {
            schemaName,
          }
        )
        .then((dbRows) =>
          dbRows.map((dbRow) => ({
            id: dbRow.id,
            uuid: dbRow.uuid,
            event: dbRow.event,
            insertedAt: dbRow.inserted_at,
          }))
        ),

    fetchById: (uuid) =>
      db
        .manyOrNone<DbRow<any>>(
          /*sql*/ `SELECT * FROM $<schemaName:name>.events WHERE uuid = $<uuid> ORDER BY inserted_at ASC`,
          {
            schemaName,
            uuid,
          }
        )
        .then((dbRows) =>
          dbRows.map((dbRow) => ({
            id: dbRow.id,
            uuid: dbRow.uuid,
            event: dbRow.event,
            insertedAt: dbRow.inserted_at,
          }))
        ),
  };
};

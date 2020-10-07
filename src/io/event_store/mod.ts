import { IDatabase } from "pg-promise";
import { EventStoreApi } from "./types";

type Create = <TEvent>(args: {
  db: IDatabase<{}>;
  schemaName: string;
}) => EventStoreApi<TEvent>;

export const createMod: Create = ({ db, schemaName }) => {
  return {
    append: (event) =>
      db
        .none(
          /*sql*/ `INSERT INTO $<table:name>.events
        (type, event)
        VALUES
        ($<event.type>, $<event>)`,
          {
            table: `${schemaName}`,
            event,
          }
        )
        .then(() => {}),
    fetchAll: () =>
      db
        .manyOrNone(
          /*sql*/ `SELECT * FROM $<table:name>.events ORDER BY inserted_at ASC`,
          {
            table: `${schemaName}`,
          }
        )
        .then((dbRows) => dbRows.map((dbRow) => dbRow.event)),
  };
};

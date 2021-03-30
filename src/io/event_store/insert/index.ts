import pgPromise from "pg-promise";
import { Err, Ok } from "../../..";
import { Insert, InsertErr, InsertOk } from "./types";

export * from "./types";

export const createInsert = ({
  db,
  name,
}: {
  db: pgPromise.IDatabase<unknown>;
  name: string;
}): Insert => async ({ idKey, idVal, event, state }) =>
  db
    .tx(async (t) => {
      const selectResult = await t.oneOrNone(
        /*sql*/ `SELECT * FROM $<name:name>.cache WHERE data->>$<idKey> = $<idVal>`,
        { idKey, idVal, name }
      );

      if (selectResult) {
        const err: Err<InsertErr> = {
          ok: false,
          error: {
            code: "io/event_store.insert->failed:item_already_exist",
            item: selectResult,
          },
        };
        return err;
      }

      await t.none(
        /*sql*/ `INSERT INTO $<name:name>.events
                  (event)
                  VALUES
                  ($<event>)`,
        {
          name,
          event,
        }
      );

      await t.none(
        /*sql*/ `INSERT INTO $<name:name>.cache
      (uuid, data)
      VALUES
      ($<uuid>, $<data>)`,
        {
          name,
          uuid: event.uuid,
          data: state,
        }
      );

      const ok: Ok<InsertOk> = { ok: true };
      return ok;
    })
    .catch((error) => {
      const err: Err<InsertErr> = {
        ok: false,
        error: {
          code: "io/event_store.insert->failed:unknown",
          innerError: error,
        },
      };

      return err;
    });

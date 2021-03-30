import pgPromise from "pg-promise";
import { Err, Ok } from "../../..";
import { Update, UpdateErr, UpdateOk } from "./types";

export * from "./types";

export const createUpdate = ({
  db,
  name,
}: {
  db: pgPromise.IDatabase<unknown>;
  name: string;
}): Update => async ({ idKey, idVal, event, reducer }) =>
  db
    .tx(async (t) => {
      const selectResult = await t.oneOrNone(
        /*sql*/ `SELECT * FROM $<name:name>.cache WHERE data->>$<idKey> = $<idVal>`,
        { idKey, idVal, name }
      );

      if (!selectResult) {
        const err: Err<UpdateErr> = {
          ok: false,
          error: {
            code: "io/event_store.update->failed:item_not_found",
            args: { idKey, idVal },
          },
        };
        return err;
      }

      const currentState = selectResult.data;

      const nextState = reducer(currentState, event);

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
        /*sql*/ `UPDATE $<name:name>.cache SET data = $<data> where uuid = $<uuid>`,
        {
          name,
          uuid: event.uuid,
          data: nextState,
        }
      );

      const ok: Ok<UpdateOk> = { ok: true };
      return ok;
    })
    .catch((error) => {
      return {
        ok: false,
        error: {
          code: "io/event_store.update->failed:unknown",
          innerError: error,
        },
      };
    });

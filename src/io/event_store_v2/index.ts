import { Err, Ok } from "../..";

import {
  Insert,
  CreateError,
  GetBy,
  GetByError,
  Update,
  UpdateError,
  Store,
} from "./types";
import Pgp from "pg-promise";
import { migrate } from "./migrate";
import { createGetBy } from "./get_by";

export * from "./types";

type Create = (args: { name: string; dbUri: string }) => Promise<Store>;

let db: Pgp.IDatabase<unknown>;

export const create: Create = async ({ name, dbUri }) => {
  if (db === undefined) {
    db = Pgp()({
      connectionString: dbUri,
    });
  }

  // Ensure DB connection.
  await db.query("select 1");

  console.log(`Event store DB connection is OK.`);

  await migrate(db, name);

  const getBy: GetBy = createGetBy({ db, name });

  const insert: Insert = async ({ idKey, idVal, event, state }) => {
    return db
      .tx(async (t) => {
        const selectResult = await t.oneOrNone(
          /*sql*/ `SELECT * FROM $<name:name>.cache WHERE data->>$<idKey> = $<idVal>`,
          { idKey, idVal, name }
        );

        if (selectResult) {
          const err: Err<CreateError> = {
            ok: false,
            error: {
              code: "io/event_store.create->failed:item_already_exist",
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

        const ok: Ok<void> = { ok: true };
        return ok;
      })
      .catch((error) => {
        return {
          ok: false,
          error: {
            code: "io/event_store.create->failed:unknown",
            innerError: error,
          },
        };
      });
  };

  const update: Update = async ({ idKey, idVal, event, reducer }) => {
    return db
      .tx(async (t) => {
        const selectResult = await t.oneOrNone(
          /*sql*/ `SELECT * FROM $<name:name>.cache WHERE data->>$<idKey> = $<idVal>`,
          { idKey, idVal, name }
        );

        if (!selectResult) {
          const err: Err<UpdateError> = {
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

        const ok: Ok<void> = { ok: true };
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
  };

  return { getBy, insert, update };
};

import { EventStoreIo, Err, Ok } from "../..";

import {
  Insert,
  CreateError,
  GetBy,
  GetByError,
  Update,
  UpdateError,
  Store,
} from "./types";

export * from "./types";

type Create = (args: { name: string; dbUri: string }) => Promise<Store>;

export const create: Create = async ({ name, dbUri }) => {
  const { db } = await EventStoreIo.createStore({ module: name, dbUri });

  const getBy: GetBy = async (key, value) => {
    try {
      const dbResult = await db.oneOrNone(
        /*sql*/ `SELECT * FROM $<name:name>.cache WHERE data->>$<key> = $<value> ORDER BY updated_at DESC LIMIT 1`,
        { key, value, name }
      );

      if (!dbResult) {
        const err: Err<GetByError> = {
          ok: false,
          error: {
            code: "io/event_store.get_by->failed:item_not_found",
            args: { key, value, name },
          },
        };

        return err;
      }

      return { ok: true, data: dbResult };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "io/event_store.get_by->failed:unknown",
          innerError: error,
        },
      };
    }
  };

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

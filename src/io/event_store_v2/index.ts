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

type CreateStore = (args: { name: string; dbUri: string }) => Promise<Store>;

export const createStore: CreateStore = async ({ name, dbUri }) => {
  const { db } = await EventStoreIo.createStore({ module: name, dbUri });

  const mod = name;

  const getBy: GetBy = async (key, value) => {
    try {
      const dbResult = await db.oneOrNone(
        /*sql*/ `SELECT * FROM $<mod:name>.cache WHERE data->>$<key> = $<value> ORDER BY updated_at DESC LIMIT 1`,
        { key, value, mod }
      );

      if (!dbResult) {
        const err: Err<GetByError> = {
          ok: false,
          error: {
            code: "io/event_store.get_by->failed:item_not_found",
            args: { key, value },
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
          /*sql*/ `SELECT * FROM $<mod:name>.cache WHERE data->>$<idKey> = $<idVal>`,
          { idKey, idVal, mod }
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
          /*sql*/ `INSERT INTO $<mod:name>.events
  (event)
  VALUES
  ($<event>)`,
          {
            mod,
            event,
          }
        );

        await t.none(
          /*sql*/ `INSERT INTO $<mod:name>.cache
        (uuid, data)
        VALUES
        ($<uuid>, $<data>)`,
          {
            mod,
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
          /*sql*/ `SELECT * FROM $<mod:name>.cache WHERE data->>$<idKey> = $<idVal>`,
          { idKey, idVal, mod }
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
          /*sql*/ `INSERT INTO $<mod:name>.events
        (event)
        VALUES
        ($<event>)`,
          {
            mod,
            event,
          }
        );

        await t.none(
          /*sql*/ `UPDATE $<mod:name>.cache SET data = $<data> where uuid = $<uuid>`,
          {
            mod,
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

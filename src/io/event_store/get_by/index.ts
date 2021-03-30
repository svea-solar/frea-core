import pgPromise from "pg-promise";
import { Err } from "types";
import { GetBy, GetByErr } from "./types";

export * from "./types";

export const createGetBy = ({
  db,
  name,
}: {
  db: pgPromise.IDatabase<unknown>;
  name: string;
}): GetBy => async (key, value) => {
  try {
    const dbResult = await db.oneOrNone(
      /*sql*/ `SELECT * FROM $<name:name>.cache WHERE data->>$<key> = $<value> ORDER BY updated_at DESC LIMIT 1`,
      { key, value, name }
    );

    if (!dbResult) {
      const err: Err<GetByErr> = {
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

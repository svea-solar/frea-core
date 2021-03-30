import pgPromise from "pg-promise";
import { serializeError } from "serialize-error";
import { createGetBy } from ".";
import { connect } from "../connect";
import { migrate } from "../migrate";

let db: pgPromise.IDatabase<unknown>;

beforeAll(async () => {
  const dbUri = process.env.DB_URI;

  if (!dbUri) throw new Error("Missing DB_URI.");

  db = await connect(dbUri);
});

afterAll(async () => {
  await db.$pool.end();
});

const setup = async (name: string) => {
  await migrate(db, name);
};

test("item_not_found", async () => {
  const expected = {
    ok: false,
    error: {
      code: "io/event_store.get_by->failed:item_not_found",
      args: { key: "id", name: "item_not_found", value: "1" },
    },
  };

  const name = "item_not_found";

  await setup(name);
  const getBy = createGetBy({ db, name });

  const result = await getBy("id", "1");

  expect(result).toEqual(expected);
});

test("unknown", async () => {
  const expected = {
    ok: false,
    error: {
      code: "io/event_store.get_by->failed:unknown",
      innerError: { message: "Cannot read property 'oneOrNone' of null" },
    },
  };

  const name = "unknown";

  const getBy = createGetBy({ db: null as any, name });

  let result = await getBy("id", "1");

  (result as any).error.innerError = {
    message: serializeError((result as any).error.innerError).message,
  };

  expect(result).toEqual(expected);
});

import { Store } from "./types";
import { migrate } from "./migrate";
import { createGetBy } from "./get_by";
import { connect } from "./connect";
import { createInsert } from "./insert";
import { createUpdate } from "./update";

export * from "./types";

type Create = (args: { name: string; dbUri: string }) => Promise<Store>;

export const create: Create = async ({ name, dbUri }) => {
  const db = await connect(dbUri);

  await migrate(db, name);

  const getBy = createGetBy({ db, name });

  const insert = createInsert({ db, name });

  const update = createUpdate({ db, name });

  return { getBy, insert, update };
};

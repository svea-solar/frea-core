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

  return {
    getBy: createGetBy({ db, name }),
    insert: createInsert({ db, name }),
    update: createUpdate({ db, name }),
  };
};

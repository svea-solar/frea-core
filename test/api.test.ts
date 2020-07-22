import { createApi } from "../src/drivers/http/api";
import { ModuleSchema, HttpApi } from "../src/drivers/http/types";
import axios from "axios";

const port = "5000";

const setupModule = (api: HttpApi) => {
  const moduleApi = {
    do_test_action: async (action: { argKey: string }) =>
      ({
        status: "succeeded",
        data: action,
      } as const),
  };

  const schema: ModuleSchema<typeof moduleApi> = {
    module: "test",
    actions: {
      do_test_action: { args: ["argKey"] },
    },
  };

  api.addModule(schema, moduleApi);
};

test("close:failed", async () => {
  const api = await createApi({ port });

  await api.close();
  const result = await api.close().catch((error) => error);

  expect(result).toEqual({
    type: "failed",
    reason: "ERR_SERVER_NOT_RUNNING",
  });
});

test("addModule and act:failed", async () => {
  const api = await createApi({ port });

  setupModule(api);

  const result = (
    await axios({
      method: "post",
      url: `http://localhost:${port}/api/test`,
      data: { type: "##missing_action_type##" },
    })
  ).data;

  await api.close();

  expect(result).toEqual({
    type: "frea_api.http.add_module:failed",
    reason: "action_type_not_supported",
    actionType: "##missing_action_type##",
  });
});

test("addModule and act:succeeded", async () => {
  const api = await createApi({ port });

  setupModule(api);

  const result = (
    await axios({
      method: "post",
      url: `http://localhost:${port}/api/test`,
      data: { type: "do_test_action", argKey: "arg_value" },
    })
  ).data;

  await api.close();

  expect(result).toEqual({
    type: "##response_event_type##",
    action: { argKey: "arg_value", type: "do_test_action" },
  });
});

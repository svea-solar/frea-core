import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Close, HttpApi, AddModule } from "./types";

type CreateApi = (args: { port: string }) => Promise<HttpApi>;

export const createApi: CreateApi = ({ port }) => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.get("/health", (_, res) => res.json({ status: "ready" }));

  app.get("/", (_, res) => res.json({ status: "ready" }));

  const addModule: AddModule = (schema, api) => {
    app.post(`/api/${schema.module}`, async (req, res) => {
      const { type } = req.body;
      const actionSchema = schema.actions[type];

      // type === any, so we need to make sure we got a schema back.
      if (!actionSchema) {
        res.json({
          type: "frea_api.http.handle_action:failed",
          reason: "action_type_not_supported",
          actionType: type,
        });
        return;
      }

      const args = actionSchema.args.reduce(
        (acc, val) => {
          acc[val] = req.body[val];
          return acc;
        },
        { type } as any
      );

      const result = await api[type](args);

      res.json(result);
    });
  };

  return new Promise<HttpApi>((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Server started on port ${port}.`);
      resolve({ close, addModule });
    });

    const close: Close = () =>
      new Promise<void>((res, rej) => {
        server.close((error) => {
          if (error) {
            rej({ type: "failed", reason: "ERR_SERVER_NOT_RUNNING" });
            return;
          }

          res();
        });
      });
  });
};

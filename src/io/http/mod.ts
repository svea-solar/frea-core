import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import requestIp from "request-ip";
import {
  Close,
  HttpMod,
  AddModule,
  ModuleSchema,
  Api,
  ApiContext,
} from "./types";
import { JwtAdapter } from "adapters";

export const createMod = <TToken extends {}>({
  port,
  corsList,
  jwt,
}: {
  jwt: JwtAdapter<TToken>;
  port: string;
  corsList: string[];
}): Promise<HttpMod> => {
  const app = express();

  let schemas: ModuleSchema<Api>[] = [];

  const corsOptions = {
    origin: corsList,
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(bodyParser.json());

  app.get("/api", (_, res) => {
    res.json(schemas);
  });

  app.get("/live", (_, res) => res.status(200).send());

  app.get("/ready", (_, res) => res.status(200).send());

  app.get("/", (_, res) => res.json({ status: "ready" }));

  const addModule: AddModule = (schema, api) => {
    schemas.push(schema);
    app.post(`/api/${schema.module}`, async (req, res) => {
      const { type } = req.body;
      const actionSchema = schema.actions[type];

      // type === any, so we need to make sure we got a schema back.
      if (!actionSchema) {
        res.json({
          ok: false,
          error: {
            reason: "action_type_not_supported",
            actionType: `${type}`,
          },
        });
        return;
      }

      const args = actionSchema.args.reduce((acc, val) => {
        acc[val] = req.body[val];
        return acc;
      }, {} as any);

      const clientIp = requestIp.getClientIp(req);
      const tokenString = req.body.token;

      let token;

      if (!actionSchema.public) {
        const jwtResult = await jwt.verify(tokenString);

        if (!jwtResult.ok) {
          res.json(jwtResult);
          return;
        }

        token = jwtResult.data;
      }

      const ctx: ApiContext = {
        type,
        token,
        clientIp: clientIp === null ? undefined : clientIp,
        clientCid: req.body.clientCid,
      };

      const result = await api[type](args, ctx);

      res.json(result);
    });
  };

  return new Promise<HttpMod>((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Server started on port ${port}.`);
      resolve({ close, addModule });
    });

    const close: Close = () =>
      new Promise<void>((res, rej) => {
        server.close((error) => {
          if (error) {
            rej({ ok: false, error: { reason: "server_not_running" } });
            return;
          }

          res();
        });
      });
  });
};

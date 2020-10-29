import http from "http";
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
  Listen,
} from "./types";
import { JwtAdapter } from "adapters";
import { ApiErr } from "../../";

export const createMod = <TToken extends {}>({
  port,
  corsList,
  jwt,
}: {
  jwt: JwtAdapter<TToken>;
  port: string;
  corsList: string[];
}): HttpMod => {
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

      const cloudTraceContext = req.header("X-Cloud-Trace-Context");
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
      const clientCid = req.body.clientCid;
      const ctx: ApiContext = {
        type,
        token,
        clientIp: clientIp === null ? undefined : clientIp,
        clientCid,
      };

      try {
        const result = await api[type](args, ctx);

        if (!result.ok) {
          console.error({
            "logging.googleapis.com/trace": cloudTraceContext,
            result,
          });
        } else {
          console.log({
            "logging.googleapis.com/trace": cloudTraceContext,
            result,
          });
        }

        return res.json(result);
      } catch (error) {
        const result: ApiErr<any> = {
          ok: false,
          error: { reason: "http_io/unknown", clientCid },
        };

        console.error({
          "logging.googleapis.com/trace": cloudTraceContext,
          result: result,
        });
        console.error(error);

        return res.json(result);
      }
    });
  };

  let server: http.Server;

  const close: Close = () =>
    new Promise<void>((res, rej) => {
      if (!server)
        return rej({ ok: false, error: { reason: "server_not_started" } });

      server.close((error) => {
        if (error)
          return rej({ ok: false, error: { reason: "server_not_running" } });

        res();
      });
    });

  const listen: Listen = () =>
    new Promise<void>((res) => {
      server = app.listen(port, () => {
        console.log(`Server started on port ${port}.`);
        res();
      });
    });

  return {
    listen,
    close,
    addModule,
  };
};

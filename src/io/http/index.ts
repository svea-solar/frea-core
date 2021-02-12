import { Jwt } from "../jwt";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import requestIp from "request-ip";
import { Close, HttpMod, AddModule, Listen, GetApi } from "./types";
import { Ctx, Err, Log, Mod, ModuleSchema } from "../../";
export * from "./types";

export const create = <TToken extends {}>({
  jwt,
  port,
  corsList,
  log,
}: {
  jwt: Jwt<TToken>;
  port: string;
  corsList: string[];
  log: Log;
}): HttpMod => {
  const app = express();

  let schemas: ModuleSchema<Mod>[] = [];

  const corsOptions = {
    origin: corsList,
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(bodyParser.json());

  app.get("/live", (_, res) => res.status(200).send());

  app.get("/ready", (_, res) => res.status(200).send());

  app.get("/", (_, res) => res.json({ status: "ready" }));

  const addModule: AddModule = (schema, api) => {
    schemas.push(schema);
    app.post(`/api/${schema.module}`, async (req, res) => {
      const { type, meta } = req.body;
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

      const traceId = req.header("X-Cloud-Trace-Context");
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
      const ctx: Ctx = {
        type,
        token,
        clientIp: clientIp === null ? undefined : clientIp,
        clientCid,
      };

      try {
        const result = await api[type](args, ctx);

        let logArgs: { [k: string]: string } = {};
        let logResult: any = {
          ...result,
        };

        if (result.ok) {
          logResult.data = {};
        } else {
          logResult.error = {
            code: result.error.code,
            innerError: result.error?.innerError,
          };
        }

        if (actionSchema.log) {
          if (actionSchema.log[0] === "*") {
            logArgs = args;
            logResult = result;
          } else {
            actionSchema.log.forEach((logKey) => {
              logArgs[logKey] = args[logKey];
              if (result.ok) {
                if ((result as any).data) {
                  logResult.data[logKey] = (result as any)?.data[logKey];
                }
              } else {
                logResult.error[logKey] = (result as any)?.error[logKey];
              }
            });
          }
        }

        if (!result.ok) {
          const resultWithoutInnerError = {
            ...result,
            error: { ...result.error, innerError: undefined },
          };

          log({
            mod: schema.module,
            type,
            severity: "error",
            traceId,
            clientCid,
            result: logResult,
            args: logArgs,
            meta,
          });

          return res.json(resultWithoutInnerError);
        } else {
          log({
            mod: schema.module,
            type,
            severity: "info",
            traceId,
            clientCid,
            result: logArgs,
            args: logResult,
          });

          return res.json(result);
        }
      } catch (error) {
        const result: Err<any> = {
          ok: false,
          error: {
            reason: "io/http/handle_action/unknown",
            code: error.code,
            innerError: {
              message: error.message,
              stack: error.stack,
              details: error.details,
            },
          },
        };

        const resultWithoutInnerError = {
          ...result,
          error: { ...result.error, innerError: undefined },
        };

        log({
          mod: schema.module,
          type,
          severity: "error",
          traceId,
          clientCid,
          result: result,
          args,
        });

        return res.json(resultWithoutInnerError);
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

  const getApi: GetApi = () => schemas;

  return {
    listen,
    close,
    addModule,
    getApi,
  };
};

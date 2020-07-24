import { ModuleSchema, Api } from "./types";
import ReactDOMServer from "react-dom/server";
import React from "react";

type FromSchemas = (schemas: ModuleSchema<Api>[]) => string;

export const fromSchemas: FromSchemas = (schemas) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement("pre", {}, JSON.stringify(schemas, null, 2))
  );

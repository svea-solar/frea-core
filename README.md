# Frea core

_Build modular TypeScript Node.js services._

## What's included in the box?

### Drivers

Drivers adapts your input/output to specific formats.

#### http

The http driver hooks your business logic (simply called `API`) to express.js routes.

### Utilities

#### getEnv

We include a `getEnv(key: string): string` function that takes an environment key, and uses dotenv under the hood to get the value, or throw if it's missing.

### Types

#### Api

Each function in an `Api` will take a property bag called `args`, and return a `Result` type.

#### ActionSchema<TApi extends Api>
  
Takes an `API`, and makes sure that the schema includes the functions from the `API`, and does some type checking on the `args` (you can only specify arguments that exist in the `API`, but it's possible to miss one by mistake).

#### Result<T, E>

A type that can be either an `Ok<T>` or `Err<E>`, wrapped in a `Promise`. This should be the type that your API functions return.

####

## Tribute
This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

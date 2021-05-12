# Deprecated

**DO NOT USE THIS UNDER ANY CIRCUMSTANCES**

# Frea core

_Build modular TypeScript Node.js services._

## What's included in the box?

### IO mod

IO mod(ule)s offer a way for your app to interact with the real world.
These should be passed as arguments into your app's mods.

#### io/http

The http IO mod hooks your mod actions to express.js routes.

*Status checks:*

All status checks are `GET` calls.

`/`: the status route. You get a JSON object containing the server status.

`/live`: returns `200` if the server is live.

`/ready`: returns `200` if the server is ready. WIP.

*API*

`/api`: By calling `addModule(modSchema, modInstance)`, you add a route based on the module's name as given in the schema. All args listed in the schema will be sent to the module action handler. A decoded `token`, an action `type`, and `clientCid` will always be sent as arguments as well in a `ctx` object as the second argument to the action handler.

### Utilities

#### getEnv

We include a `getEnv(key: string): string` function that takes an environment key, and uses dotenv under the hood to get the value, or throw if it's missing.

### Types

#### Api

Each function in an `Api` will take a property bag called `args` as first argument, and `ctx` as the second. It returns an `ApiResult` type.

#### ActionSchema<TApi extends Api>
  
Takes an `API`, and makes sure that the schema includes the functions from the `API`, and does some type checking on the `args`. You can only specify arguments that exist in the `API`, but it's possible to miss one by mistake. It only checks shallow arguments.

#### ApiResult<T, E>

A type that can be either an `ApiOk<T>` or `ApiErr<E>`, wrapped in a `Promise`. This should be the type that your API functions return.

####

## Tribute
This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Releasing

* Get latest from master branch.
* `npm version minor`
* `git push`
* `git push --tags`
* `npm publish`


import { create } from ".";

describe("sign", () => {});

describe("verify", () => {
  test("ok", async () => {
    const expectation = { ok: true, data: { data: "ok", iat: 1610541201 } };

    const jwt = create<{ data: "ok" }>({ jwtSecret: "##jwtSecret##" });
    const signedJwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoib2siLCJpYXQiOjE2MTA1NDEyMDF9.WRKeELKscczRkSn229uXjHjBRj_J0x7bxzIPUGLpjNU";

    const result = await jwt.verify(signedJwt);

    expect(result).toEqual(expectation);
  });

  test("err", async () => {
    const expectation = {
      ok: false,
      error: {
        code: "token_verification_failed",
        innerError: {
          name: "JsonWebTokenError",
          message: "jwt must be provided",
        },
      },
    };

    const jwt = create({ jwtSecret: "supersecret" });

    const result = await jwt.verify("");

    expect(result).toEqual(expectation);
  });
});

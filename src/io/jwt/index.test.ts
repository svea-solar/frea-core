import { create } from ".";

describe("sign", () => {
  test('ok', async () => {
    const expectation = { ok: true, data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiNlbWFpbCMiLCJpYXQiOjEwfQ.YWP8h_BYdEZd4CCQZwunD7O56cGOUdZaVOpHh5OYcLk" };

    const jwt = create<{ email: string, iat: number }>({ jwtSecret: "#jwtSecret#" });
    const result = await jwt.sign({ email: "#email#", iat: 10 });

    expect(result).toEqual(expectation);
  })
});


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

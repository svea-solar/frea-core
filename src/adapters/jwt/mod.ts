import jwt from "jsonwebtoken";

import { JwtAdapter, Sign, Verify } from "./types";

export const createMod = <T extends {}>({
  jwtSecret,
}: {
  jwtSecret: string;
}): JwtAdapter<T> => {
  const verify: Verify<T> = (tokenString) =>
    // Why do we need the any here?
    new Promise<any>((res) => {
      jwt.verify(tokenString, jwtSecret, async (err, token) => {
        if (err) {
          return res({
            ok: false,
            error: { reason: "token_verification_failed" },
          });
        }

        res({
          ok: true,
          // if err is false, token will always be T, but we need to cast it unsafely.
          data: token as T,
        });
      });
    });

  const sign: Sign<T> = (data) =>
    new Promise((res) => {
      jwt.sign(data, jwtSecret, (err, token) => {
        if (err) {
          return res({
            ok: false,
            error: { reason: "token_sign_failed" },
          });
        }

        res({
          ok: true,
          // if err is false, token will always be a string, but we need to cast it unsafely.
          data: token as string,
        });
      });
    });

  return {
    verify,
    sign,
  };
};

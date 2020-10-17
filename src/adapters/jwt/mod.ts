import jwt from "jsonwebtoken";

import { JwtAdapter, Sign, TokenData, Verify } from "./types";

type Create = (args: { jwtSecret: string }) => JwtAdapter;

export const createMod: Create = ({ jwtSecret }) => {
  const verify: Verify = async ({ token }) => {
    try {
      const tokenData = jwt.verify(token, jwtSecret) as TokenData;

      return { ok: true, data: tokenData };
    } catch (e) {
      return {
        ok: false,
        error: {
          reason: "token_verification_failed",
        },
      };
    }
  };

  const sign: Sign = async ({ data }) =>
    new Promise(async (res) => {
      jwt.sign(data, jwtSecret, async (err, token) => {
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

import jwt from "jsonwebtoken";

import { JwtAdapter, Sign, TokenData, Verify } from "./types";

type CreateApi = (args: { secret: string }) => JwtAdapter;

export const createApi: CreateApi = ({ secret }) => {
  const verify: Verify = async ({ token }) => {
    try {
      const tokenData = jwt.verify(token, secret) as TokenData;

      return { ok: true, data: tokenData };
    } catch (e) {
      return {
        ok: false,
        error: {
          reason: "verification_failed",
        },
      };
    }
  };

  const sign: Sign = async ({ data }) =>
    new Promise(async (res) => {
      jwt.sign(data, secret, async (err, token) => {
        if (err) {
          return res({
            ok: false,
            error: { reason: "sign_failed" },
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

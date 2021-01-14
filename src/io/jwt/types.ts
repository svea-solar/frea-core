import { Result } from "../..";

export type VerifyErr = {
  code: "token_verification_failed";
  // TODO: Check why innerError isn't needed, and then add it.
};

export type Verify<T extends {}> = (token: string) => Result<T, VerifyErr>;

export type SignOk = string;

export type SignErr = {
  code: "token_sign_failed";
  innerError: {
    name: string;
    message: string;
  };
};

export type Sign<T extends {}> = (data: T) => Result<SignOk, SignErr>;

export type Jwt<T extends {}> = {
  verify: Verify<T>;
  sign: Sign<T>;
};

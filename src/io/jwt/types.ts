import { Result } from "../..";

export type VerifyErr = {
  code: "token_verification_failed";
};

export type Verify<T extends {}> = (token: string) => Result<T, VerifyErr>;

export type SignOk = string;

export type SignErr = {
  code: "token_sign_failed";
};

export type Sign<T extends {}> = (data: T) => Result<SignOk, SignErr>;

export type Jwt<T extends {}> = {
  verify: Verify<T>;
  sign: Sign<T>;
};

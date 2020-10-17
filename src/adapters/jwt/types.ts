import { ApiResult } from "../../";

export type VerifyError = {
  reason: "token_verification_failed";
};

export type Verify<T extends {}> = (token: string) => ApiResult<T, VerifyError>;

export type SignData = string;

export type SignError = {
  reason: "token_sign_failed";
};

export type Sign<T extends {}> = (data: T) => ApiResult<SignData, SignError>;

export type JwtAdapter<T extends {}> = {
  verify: Verify<T>;
  sign: Sign<T>;
};

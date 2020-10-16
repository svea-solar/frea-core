import { ApiResult } from "../../";

export type TokenData = {
  email: string;
};

export type VerifyError = {
  reason: "token_verification_failed";
};

export type Verify = (args: {
  token: string;
}) => ApiResult<TokenData, VerifyError>;

export type SignData = string;

export type SignError = {
  reason: "token_sign_failed";
};

export type Sign = (args: {
  data: TokenData;
}) => ApiResult<SignData, SignError>;

export type JwtAdapter = {
  verify: Verify;
  sign: Sign;
};

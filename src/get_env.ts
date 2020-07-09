import dotenv from "dotenv";

let initialized = false;

type GetEnv = (key: string) => string;

export const getEnv: GetEnv = (key: string) => {
  if (!initialized) {
    dotenv.config();
    initialized = true;
  }

  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing env key ${key}.`);
  }

  return value;
};

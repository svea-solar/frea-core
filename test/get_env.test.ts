import { getEnv } from "../src/get_env";

test("getEnv:failed", () => {
  expect(() => getEnv("##MISSING_ENV##")).toThrow();
});

test("getEnv:succeeded", () => {
  expect(getEnv("NODE_ENV")).toEqual("test");
});

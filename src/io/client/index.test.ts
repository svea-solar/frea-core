import { ClientIo } from "../";

test("empty arguments", async () => {
  const expected = { ok: false, code: "io/client.post->unknown" };
  const innerErrorExpected = "object";

  const client = ClientIo.create({ apiKey: "", baseUrl: "" });
  const response = await client.post({ url: "", data: null });

  if (response.ok) throw "Expected !response.ok.";

  const { innerError } = response.error;

  const result = { ok: response.ok, code: response.error.code };
  const innerErrorResult = typeof innerError;

  expect(result).toEqual(expected);
  expect(innerErrorResult).toEqual(innerErrorExpected);
});

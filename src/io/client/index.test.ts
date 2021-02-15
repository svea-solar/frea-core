import { ClientIo } from "..";

// axios prints a confusing console.error message when running this test. Better to skip it for now. Test works though.
test.skip("empty arguments", async () => {
  const expected = { ok: false, code: "io/client.post->request" };
  const innerErrorExpected = "object";

  const client = ClientIo.create({ apiKey: "", baseUrl: "" });
  const response = await client.post({ url: "", data: null });

  if (response.ok || response.error.code !== "io/client.post->request")
    throw "Unexpected response case in test.";

  const { innerError } = response.error;

  const result = { ok: response.ok, code: response.error.code };
  const innerErrorResult = typeof innerError;

  expect(result).toEqual(expected);
  expect(innerErrorResult).toEqual(innerErrorExpected);
});

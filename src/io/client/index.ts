import Axios, { AxiosError } from "axios";
import { Err, Ok } from "../..";
import { Client, PostErr } from "./types";

export * from "./types";

export const create = ({
  apiKey,
  baseUrl,
}: {
  apiKey: string;
  baseUrl: string;
}): Client => {
  const axios = Axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    baseURL: baseUrl,
  });

  const post = async <TOk>({ url, data }: { url: string; data?: string }) => {
    try {
      const response = await axios.post(url, data);
      return { ok: true, data: response.data } as Ok<TOk>;
    } catch (error) {
      return handleHapiError(error);
    }
  };

  return { post };
};

const handleHapiError = (error: AxiosError): Err<PostErr> => {
  if (error.response) {
    if (
      error.response.data.statusCode === 400 &&
      error.response.data.error === "Bad Request" &&
      error.response.data.validation
    ) {
      return {
        ok: false,
        error: {
          ...error.response.data,
          code: "io/client.post->invalid_request",
        },
      };
    }

    return {
      ok: false,
      error: {
        ...error.response.data,
        code: "io/client.post->response",
      },
    };
  }

  if (error.request) {
    return {
      ok: false,
      error: {
        code: "io/client.post->request",
        innerError: error,
      },
    };
  }
  return {
    ok: false,
    error: {
      code: "io/client.post->unknown",
      innerError: error,
    },
  };
};

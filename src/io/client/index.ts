import Axios, { AxiosError } from "axios";
import { Err } from "../..";
import { Client, Post, PostErr } from "./types";

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

  const post: Post = async ({ url, data }) => {
    try {
      const response = await axios.post(url, data);
      return { ok: true, data: response.data };
    } catch (error) {
      const result = handleHapiError(error);
      return result;
    }
  };

  return { post };
};

const handleHapiError = (error: AxiosError): Err<PostErr> => ({
  ok: false,
  error: {
    code: "io/client.post->unknown",
    // code: error?.request?.error,
    // status: error?.request?.statusCode,
    innerError: error,
  },
});

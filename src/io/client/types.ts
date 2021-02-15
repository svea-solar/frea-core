import { AxiosError } from "axios";
import { Result } from "../..";

export type PostErr =
  | {
      code: "io/client.post->response";
      statusCode: string;
      error: string;
      message: string;
    }
  | { code: "io/client.post->request"; innerError: AxiosError }
  | {
      code: "io/client.post->unknown";
      innerError: AxiosError;
    };

export type Post = (args: { url: string; data?: any }) => Result<any, PostErr>;

export type Client = {
  post: Post;
};

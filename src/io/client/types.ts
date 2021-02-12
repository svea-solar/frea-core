import { Result } from "../..";

export type PostErr = {
  code: "io/client.post->unknown";
  innerError: Error;
};

export type Post = (args: { url: string; data?: any }) => Result<any, PostErr>;

export type Client = {
  post: Post;
};

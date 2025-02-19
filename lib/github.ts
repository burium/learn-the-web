import { getGithubLastEdit } from "fumadocs-core/server";

export const getLastModified = async (path: string) => {
  const lastEdit = await getGithubLastEdit({
    owner: "r4ultv",
    repo: "learn-the-web",
    path: `content/docs/${path}`,
    token: process.env.GITHUB_TOKEN,
  });

  return lastEdit;
};

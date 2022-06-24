import { DefaultApi, Configuration } from "@db-course/api-client/src-openapi-autogen";

export const API_URL = "http://localhost:3333";

export const createApiClient = async () => {
  return new DefaultApi(
    new Configuration({
      basePath: API_URL,
    }),
  );
};

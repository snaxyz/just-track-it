export const config = {
  env: process.env.ENVIRONMENT ?? "local",
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  ws: {
    secret: process.env.SOCKET_SECRET,
    endpoint: process.env.AGENT_WSS_ENDPOINT,
  },
  apigw: {
    endpoint: process.env.APIGW_ENDPOINT,
  },
  dynamo: {
    connectionsTable: process.env.DYNAMO_CONNECTIONS_TABLE_NAME,
  },
};

export type Config = typeof config;

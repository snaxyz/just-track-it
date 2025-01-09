export const config = {
  aws: {
    region: process.env.AWS_REGION,
  },
  agentQueue: {
    url: process.env.SQS_AGENT_URL,
  },
};

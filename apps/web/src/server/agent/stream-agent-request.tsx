"use server";

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: process.env.AWS_REGION || "us-west-2" });

export async function streamAgentRequest({
  userId,
  chatId,
  message,
}: {
  userId: string;
  chatId: string;
  message: string;
}) {
  const queueUrl = process.env.AGENT_SQS_URL;

  if (!queueUrl) {
    throw new Error("AGENT_SQS_URL is not defined");
  }

  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({
      type: "chat:message",
      payload: {
        userId,
        chatId,
        message,
      },
    }),
  });

  await sqs.send(command);
  return true;
}

"use server";

import { InvokeCommand, LambdaClient, LogType } from "@aws-sdk/client-lambda";

export async function streamAgentRequest(
  {
    userId,
    chatId,
    message,
    prevMessages = [],
    preferredResponseFormat = ChatResponseFormat.CONVERSATIONAL,
  }: StreamChatInput,
  options: StreamChatOptions = {}
) {
  const client = new LambdaClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.LAMBDA_ENDPOINT,
  });
  const command = new InvokeCommand({
    FunctionName: process.env.LAMBDA_AGENT_HANDLER,
    InvocationType: "Event",
    Payload: JSON.stringify({
      type: "STREAM_CHAT_MESSAGE",
      userId,
      chatId,
      message,
      prevMessages,
      preferredResponseFormat,
    }),
    LogType: LogType.Tail,
  });
  await client.send(command);
}

interface PrevChatMessage {
  role: "ai" | "user";
  content: string;
}

interface StreamChatInput {
  userId: string;
  chatId?: string;
  message: string;
  prevMessages?: PrevChatMessage[];
  preferredResponseFormat?: ChatResponseFormat;
}

interface StreamChatOptions {
  model?: "gpt-4o-mini" | "gpt-4o";
}

enum ChatResponseFormat {
  MARKDOWN,
  CONVERSATIONAL,
}

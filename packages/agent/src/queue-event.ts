import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { config } from "./config";
import { Event } from "./types";

export async function queueEvent(event: Event) {
  const sqs = new SQSClient({
    region: config.aws.region,
  });

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: config.agentQueue.url,
      MessageBody: JSON.stringify(event),
    })
  );
}

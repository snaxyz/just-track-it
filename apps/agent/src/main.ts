import {
  SQSHandler,
  SQSRecord,
  APIGatewayProxyWebsocketHandlerV2,
  SQSEvent,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayEvent,
} from "aws-lambda";
import { Message, MessageType } from "./types";
import { createContext } from "./context";
import { config } from "./config";

function parseMessage(record: SQSRecord): Message {
  const message = JSON.parse(record.body);
  if (!message.type || !Object.values(MessageType).includes(message.type)) {
    throw new Error(`Invalid message type: ${message.type}`);
  }
  return message as Message;
}

export const handler = async (event: SQSEvent | APIGatewayProxyWebsocketEventV2) => {
  const context = createContext(config);

  // Handle WebSocket events
  if ("requestContext" in event) {
    const { routeKey, connectionId } = event.requestContext;

    const { queryStringParameters } = event as unknown as { queryStringParameters: Record<string, string> };
    switch (routeKey) {
      case "$connect":
        await context.eventsGateway.handleConnection({
          connectionId,
          queryStringParameters,
        });
        return { statusCode: 200, body: "Connected" };

      case "$disconnect":
        await context.eventsGateway.handleDisconnect(connectionId);
        return { statusCode: 200, body: "Disconnected" };

      default:
        return { statusCode: 400, body: "Unknown route" };
    }
  }

  // Handle SQS events
  for (const record of event.Records) {
    const message = parseMessage(record);

    switch (message.type) {
      case MessageType.ChatMessage:
        await context.chatService.streamMessage(message.payload);
        break;
      case MessageType.GenerateWorkout:
        await context.generateService.generateWorkout(message.payload);
        break;
      default: {
        throw new Error(`Unhandled message type: ${(message as any).type}`);
      }
    }
  }
};

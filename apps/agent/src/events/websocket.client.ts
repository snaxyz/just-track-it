import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { ChatMessageEvent, GenerateWorkoutMessageEvent } from "./types";

export class WebSocketClient {
  private apiGatewayClient: ApiGatewayManagementApiClient;

  constructor(endpoint: string) {
    this.apiGatewayClient = new ApiGatewayManagementApiClient({
      endpoint,
      region: "us-west-2",
    });
  }

  async postToConnection(connectionId: string, data: any) {
    try {
      const command = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      });

      await this.apiGatewayClient.send(command);
    } catch (error) {
      if ((error as any).name === "GoneException") {
        console.error("Connection gone:", connectionId);
      }
    }
  }

  async emitChatMessage(connectionId: string, message: ChatMessageEvent) {
    await this.postToConnection(connectionId, {
      event: "chat:message",
      data: message,
    });
  }

  async emitGenerateWorkoutMessage(connectionId: string, message: GenerateWorkoutMessageEvent) {
    await this.postToConnection(connectionId, {
      event: "generate-workout:message",
      data: message,
    });
  }
}

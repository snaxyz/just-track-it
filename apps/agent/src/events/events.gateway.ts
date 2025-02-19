import { verify } from "jsonwebtoken";
import { ApiGatewayClient, ChatMessageEvent, GenerateWorkoutMessageEvent } from "./types";
import { Config } from "@/config";
import { WebSocketClient } from "./websocket.client";
import { Connection, ConnectionsStore } from "./connections";

export class EventsGateway {
  private connectionsStore: ConnectionsStore;
  private wsClient: WebSocketClient;

  constructor(private config: Config) {
    this.wsClient = new WebSocketClient(config.apigw.endpoint);
    this.connectionsStore = new ConnectionsStore(config);
  }

  async handleConnection(client: ApiGatewayClient) {
    try {
      const connectionId = client.connectionId;
      const queryParams = new URLSearchParams(client.queryStringParameters || {});
      const socketToken = queryParams.get("token");

      if (!socketToken) {
        throw new Error("No socket token found");
      }

      const decoded = verify(socketToken, this.config.ws.secret);
      const userId = decoded.sub as string;
      await this.connectionsStore.addConnection(userId, connectionId);
    } catch (error) {
      console.error("Connection refused:", error);
      throw error;
    }
  }

  async handleDisconnect(connectionId: string) {
    try {
      // Find all users and remove this connection
      // This is not optimal but works for now
      const users = await this.connectionsStore.getAllUsers();
      for (const userId of users) {
        const connection = await this.connectionsStore.getConnection(userId, connectionId);
        if (connection) {
          await this.connectionsStore.removeConnection(userId, connectionId);
          break;
        }
      }
    } catch (error) {
      console.error("Disconnect failed:", error);
      throw error;
    }
  }

  async getConnections(userId: string) {
    return await this.connectionsStore.getUserConnections(userId);
  }

  async emitChatMessage(connections: Connection[], message: ChatMessageEvent) {
    for (const connection of connections) {
      await this.wsClient.emitChatMessage(connection.connectionId, message);
    }
  }

  async emitGenerateWorkoutMessage(userId: string, message: GenerateWorkoutMessageEvent) {
    const connections = await this.connectionsStore.getUserConnections(userId);
    for (const connection of connections) {
      await this.wsClient.emitGenerateWorkoutMessage(connection.connectionId, message);
    }
  }
}

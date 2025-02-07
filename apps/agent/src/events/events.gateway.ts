import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UnauthorizedException, Injectable } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";
import { ApiGatewayManagementApi } from "aws-sdk";

export interface ChatMessageEvent {
  userId: string;
  chatId: string;
  messageId: string;
  content: string;
  finishReason?: string;
}

interface WebSocketConnection {
  connectionId: string;
  userId: string;
  rooms: Set<string>;
}

interface ApiGatewayClient {
  connectionId: string;
  headers: any;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private apiGatewayClient: ApiGatewayManagementApi;
  private connections: Map<string, WebSocketConnection> = new Map();
  private roomConnections: Map<string, Set<string>> = new Map();

  constructor() {
    if (process.env.USE_API_GATEWAY === "true") {
      this.apiGatewayClient = new ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: process.env.WEBSOCKET_API_ENDPOINT,
      });
    }
  }

  private isApiGateway(): boolean {
    return process.env.USE_API_GATEWAY === "true";
  }

  async handleConnection(client: Socket | ApiGatewayClient) {
    try {
      if (this.isApiGateway()) {
        const connectionId = (client as any).connectionId;
        const cookies = parse((client as any).headers.Cookie || "");
        const socketToken = cookies["socket_token"];

        if (!socketToken) {
          throw new UnauthorizedException("No socket token found");
        }

        const decoded = verify(socketToken, process.env.SOCKET_SECRET!);
        this.connections.set(connectionId, {
          connectionId,
          userId: decoded.sub as string,
          rooms: new Set(),
        });
      } else {
        const cookies = parse((client as Socket).handshake.headers.cookie || "");
        const socketToken = cookies["socket_token"];

        if (!socketToken) {
          throw new UnauthorizedException("No socket token found");
        }

        const decoded = verify(socketToken, process.env.SOCKET_SECRET!);
        (client as Socket).data.user = decoded;
        console.log(`Client connected: ${(client as Socket).id}`);
      }
    } catch (error) {
      if (!this.isApiGateway()) {
        (client as Socket).disconnect();
      }
      console.error("Connection refused:", error);
    }
  }

  handleDisconnect(client: Socket | ApiGatewayClient) {
    if (this.isApiGateway()) {
      const connectionId = (client as any).connectionId;
      const connection = this.connections.get(connectionId);
      if (connection) {
        // Remove from all rooms
        connection.rooms.forEach((room) => {
          const roomConnections = this.roomConnections.get(room);
          roomConnections?.delete(connectionId);
        });
        this.connections.delete(connectionId);
      }
    } else {
      console.log(`Client disconnected: ${(client as Socket).id}`);
    }
  }

  @SubscribeMessage("join")
  handleJoinRoom(client: Socket | ApiGatewayClient, room: string) {
    if (this.isApiGateway()) {
      const connectionId = (client as any).connectionId;
      const connection = this.connections.get(connectionId);
      if (!connection) return;

      connection.rooms.add(room);
      if (!this.roomConnections.has(room)) {
        this.roomConnections.set(room, new Set());
      }
      this.roomConnections.get(room)?.add(connectionId);
    } else {
      const userId = (client as Socket).data.user.sub;
      const chatId = room.replace("chat:", "");

      if (!userId) {
        (client as Socket).disconnect();
        return;
      }

      console.log(`Client ${(client as Socket).id} joining room: ${room}`);
      (client as Socket).join(room);
    }
  }

  @SubscribeMessage("leave")
  handleLeaveRoom(client: Socket | ApiGatewayClient, room: string) {
    if (this.isApiGateway()) {
      const connectionId = (client as any).connectionId;
      const connection = this.connections.get(connectionId);
      if (!connection) return;

      connection.rooms.delete(room);
      this.roomConnections.get(room)?.delete(connectionId);
    } else {
      console.log(`Client ${(client as Socket).id} leaving room: ${room}`);
      (client as Socket).leave(room);
    }
  }

  async emitChatMessage(chatId: string, message: ChatMessageEvent) {
    if (this.isApiGateway()) {
      const room = `chat:${chatId}`;
      const connections = this.roomConnections.get(room) || new Set();

      const messageData = JSON.stringify({ event: "chat:message", data: message });

      for (const connectionId of connections) {
        try {
          await this.apiGatewayClient
            .postToConnection({
              ConnectionId: connectionId,
              Data: messageData,
            })
            .promise();
        } catch (error) {
          if (error.statusCode === 410) {
            // Connection is stale, remove it
            this.connections.delete(connectionId);
            connections.delete(connectionId);
          }
        }
      }
    } else {
      this.server.to(`chat:${chatId}`).emit("chat:message", message);
    }
  }

  async emitGenerateWorkoutMessage(generateId: string, message: GenerateWorkoutMessageEvent) {
    if (this.isApiGateway()) {
      const room = `workout:${generateId}`;
      const connections = this.roomConnections.get(room) || new Set();

      const messageData = JSON.stringify({ event: "generate-workout:message", data: message });

      for (const connectionId of connections) {
        try {
          await this.apiGatewayClient
            .postToConnection({
              ConnectionId: connectionId,
              Data: messageData,
            })
            .promise();
        } catch (error) {
          if (error.statusCode === 410) {
            this.connections.delete(connectionId);
            connections.delete(connectionId);
          }
        }
      }
    } else {
      this.server.to(`workout:${generateId}`).emit("generate-workout:message", message);
    }
  }
}

interface GenerateWorkoutMessageEvent {
  content: string;
  finishReason?: string;
}

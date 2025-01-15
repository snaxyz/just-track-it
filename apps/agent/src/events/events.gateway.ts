import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UnauthorizedException } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";

export interface ChatMessageEvent {
  userId: string;
  chatId: string;
  messageId: string;
  content: string;
  finishReason?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const cookies = parse(client.handshake.headers.cookie || "");
      const socketToken = cookies["socket_token"];

      if (!socketToken) {
        throw new UnauthorizedException("No socket token found");
      }

      // Verify our short-lived socket token
      const decoded = verify(socketToken, process.env.SOCKET_SECRET!);
      client.data.user = decoded;
      console.log(`Client connected: ${client.id}`);
    } catch (error) {
      client.disconnect();
      console.error("Connection refused:", error);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join")
  handleJoinRoom(client: Socket, room: string) {
    // Verify the user has access to this chat room
    const userId = client.data.user.sub;
    const chatId = room.replace("chat:", "");

    // You could add additional checks here to verify the user has access to this chat
    if (!userId) {
      client.disconnect();
      return;
    }

    console.log(`Client ${client.id} joining room: ${room}`);
    client.join(room);
  }

  @SubscribeMessage("leave")
  handleLeaveRoom(client: Socket, room: string) {
    console.log(`Client ${client.id} leaving room: ${room}`);
    client.leave(room);
  }

  emitChatMessage(chatId: string, message: ChatMessageEvent) {
    console.log(`Emitting to room chat:${chatId}:`, message);
    this.server.to(`chat:${chatId}`).emit("chat:message", message); // Now we can safely use rooms
  }
}

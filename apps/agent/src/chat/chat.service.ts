import { nanoid } from "nanoid";
import { AgentService } from "@/agent/agent.service";
import { db } from "@local/db";
import { EventsGateway } from "@/events/events.gateway";
import { StreamChatMessageInput } from "./types";

export class ChatService {
  constructor(
    private readonly agentService: AgentService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async streamMessage(input: StreamChatMessageInput) {
    const { userId, chatId, message } = input;
    const chatMessages = await db.chatMessage.query(userId, chatId, { order: "desc", limit: 20 });
    const chatHistory = chatMessages.records
      .map((c) => ({
        content: c.content,
        role: c.role as "user" | "assistant" | "system",
      }))
      .reverse();

    const connections = await this.eventsGateway.getConnections(userId);
    const stream = await this.agentService.stream({ message, chatHistory, userId });
    const responseChunks: string[] = [];

    for await (const chunk of stream) {
      responseChunks.push(chunk);

      await this.eventsGateway.emitChatMessage(connections, {
        userId,
        chatId,
        messageId: "",
        content: chunk,
      });
    }

    const id = nanoid();

    await db.chatMessage.create({
      id,
      userId,
      chatId,
      role: "assistant",
      content: responseChunks.join(""),
    });

    await this.eventsGateway.emitChatMessage(connections, {
      userId,
      chatId,
      messageId: id,
      content: "",
      finishReason: "stop",
    });
  }
}

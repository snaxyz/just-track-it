import { Injectable } from "@nestjs/common";
import { StreamChatMessageDto } from "./dto/stream-chat-message.dto";
import { AgentService } from "../agent/agent.service";
import { db } from "@local/db";
import { MessageType } from "llamaindex";
import { EventsGateway } from "../events/events.gateway";

@Injectable()
export class ChatService {
  constructor(
    private readonly agentService: AgentService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async streamMessage(input: StreamChatMessageDto) {
    const { userId, chatId, message } = input;
    const chatMessages = await db.chatMessage.query(userId, chatId, { order: "desc", limit: 20 });
    const chatHistory = chatMessages.records
      .map((c) => ({
        content: c.content,
        role: c.role as MessageType,
      }))
      .reverse();

    const stream = await this.agentService.streamChat({ message, chatHistory, userId });
    const responseChunks: string[] = [];
    let sequence = 0;

    for await (const chunk of stream) {
      const content = chunk.message.content.toString();
      responseChunks.push(content);

      this.eventsGateway.emitChatMessage(chatId, {
        userId,
        chatId,
        messageId: "",
        content,
        sequence: sequence++,
      });
    }

    const { id } = await db.chatMessage.create({
      userId,
      chatId,
      role: "ai",
      content: responseChunks.join(""),
    });

    this.eventsGateway.emitChatMessage(chatId, {
      userId,
      chatId,
      messageId: id,
      content: "",
      sequence: sequence++,
      finishReason: "stop",
    });
  }
}

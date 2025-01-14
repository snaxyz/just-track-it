import { Injectable } from "@nestjs/common";
import { ChatEvent, getChatChannel, PusherClient } from "@local/realtime";
import { StreamChatMessageDto } from "./dto/stream-chat-message.dto";
import { AgentService } from "../agent/agent.service";
import { db } from "@local/db";
import { MessageType } from "llamaindex";

@Injectable()
export class ChatService {
  constructor(private readonly agentService: AgentService) {}

  async streamMessage(input: StreamChatMessageDto) {
    const { userId, chatId, message } = input;
    const pusher = new PusherClient();
    const chatMessages = await db.chatMessage.query(userId, chatId, { order: "desc", limit: 20 });
    const chatHistory = chatMessages.records
      .map((c) => ({
        content: c.content,
        role: c.role as MessageType,
      }))
      .reverse();
    const stream = await this.agentService.streamChat({ message, chatHistory });
    const responseChunks: string[] = [];
    for await (const chunk of stream) {
      const content = chunk.message.content.toString();
      responseChunks.push(content.toString());
      await pusher.trigger(getChatChannel(chatId), ChatEvent.MESSAGE_POSTED, {
        userId,
        chatId,
        messageId: "",
        content,
        finishReason: undefined,
      });
    }
    const { id } = await db.chatMessage.create({
      userId,
      chatId,
      role: "ai",
      content: responseChunks.join(""),
    });
    await pusher.trigger(getChatChannel(chatId), ChatEvent.MESSAGE_POSTED, {
      userId,
      chatId,
      messageId: id,
      content: "",
      finishReason: "stop",
    });
  }
}

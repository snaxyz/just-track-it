import { db } from "@local/db";
import { ChatEvent, getChatChannel, PusherClient } from "@local/realtime";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatMessage, ChatResponseFormat } from "./types";
import { LLM } from "@local/llm";
import { queueEvent } from "./queue-event";

const capabilities = ["createWorkout"];

export async function streamChatMessage({
  userId,
  chatId,
  message,
  prevMessages,
  preferredResponseFormat = ChatResponseFormat.CONVERSATIONAL,
}: {
  userId: string;
  chatId: string;
  message: string;
  prevMessages: ChatMessage[];
  preferredResponseFormat?: ChatResponseFormat;
}) {
  const pusher = new PusherClient();
  const llm = new LLM();

  const stream = await llm.streamChatMessage({
    messages: [
      new SystemMessage(
        `You are a fitness expert.
        You prefer to respond with markdown and format your output so that is easy to read and comprehend.
        You can generate workouts and exercises for users based on their preferences and information they give you,
        like their fitness goals, fitness level, and equipment availability.`
      ),
      ...prevMessages.map((m) => {
        if (m.role === "ai") {
          return new AIMessage(m.content);
        }
        return new HumanMessage(m.content);
      }),
      new HumanMessage(
        `${message}${
          preferredResponseFormat === ChatResponseFormat.MARKDOWN
            ? ". Respond in markdown format."
            : "."
        }`
      ),
    ],
  });

  const messageChunks: string[] = [];
  let messageId = "";

  for await (const chunk of stream) {
    const finishReason = chunk["response_metadata"]["finish_reason"];
    const content = chunk["lc_kwargs"]["content"];
    messageChunks.push(content);
    if (finishReason === "stop") {
      const streamedMessage = messageChunks.join("");
      try {
        const chatMessage = await db.chatMessage.create({
          userId,
          chatId,
          role: "ai",
          content: streamedMessage,
        });
        messageId = chatMessage.id;
        await queueEvent({
          type: "REVIEW_LAST_RESPONSE",
          userId,
          chatId,
          messageId,
        });
      } catch (error) {
        console.error("Error creating chat message", error);
        console.error((error as Error).message);
      }
    }

    await pusher.trigger(getChatChannel(chatId), ChatEvent.MESSAGE_POSTED, {
      userId,
      chatId,
      messageId,
      content,
      finishReason,
    });
  }
}

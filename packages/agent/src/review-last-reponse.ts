import { db } from "@local/db";
import { ReviewLastResponseEvent } from "./types";
import { LLM } from "@local/llm";
import { queueEvent } from "./queue-event";

export async function reviewLastResponse(event: ReviewLastResponseEvent) {
  const message = await db.chatMessage.findById(event.userId, event.messageId);
  if (!message) {
    console.warn(`Message not found: ${event.messageId}`);
    return;
  }
  const result = await new LLM().isMessageCreatingWorkout(message.content);
  switch (result) {
    case "yes":
      return await queueEvent({
        type: "CREATE_WORKOUT",
        userId: event.userId,
        chatId: event.chatId,
        messageId: event.messageId,
      });
    case "multiple":
      return await queueEvent({
        type: "CREATE_MULTIPLE_WORKOUTS",
        userId: event.userId,
        chatId: event.chatId,
        messageId: event.messageId,
      });
    case "no":
      return;
    default:
      console.warn(`Unknown result: ${result}`);
  }
}

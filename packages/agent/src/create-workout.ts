import { db } from "@local/db";
import { LLM } from "@local/llm";
import { CreateWorkoutEvent } from "./types";

export async function createWorkout(event: CreateWorkoutEvent) {
  const message = await db.chatMessage.findById(event.userId, event.messageId);
  if (!message) {
    console.warn(`Message not found: ${event.messageId}`);
    return;
  }
  const workout = await new LLM().createWorkout(message.content);
  console.log(JSON.stringify(workout));
}

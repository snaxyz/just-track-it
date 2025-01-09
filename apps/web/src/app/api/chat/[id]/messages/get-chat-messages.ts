import {
  ChatMessageModel,
  QueryResponse,
  WorkoutModel,
  WorkoutWithRelations,
} from "@local/db";

export async function getChatMessages(
  chatId: string
): Promise<QueryResponse<ChatMessageModel>> {
  const response = await fetch(`/api/chat/${chatId}/messages`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat messages");
  }

  return await response.json();
}

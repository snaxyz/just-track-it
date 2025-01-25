"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function createUserChatMessage(chatId: string, content: string, id: string) {
  const userId = await getUserId();
  return await db.chatMessage.create({ id, chatId, userId, role: "user", content });
}

"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function createUserChatMessage(chatId: string, content: string) {
  const userId = await getUserId();
  return await db.chatMessage.create({ chatId, userId, role: "user", content });
}

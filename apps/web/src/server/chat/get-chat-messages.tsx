"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function getChatMessagesServer(chatId: string) {
  const userId = await getUserId();
  return await db.chatMessage.query(userId, chatId);
}

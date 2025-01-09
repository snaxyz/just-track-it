"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function createOrGetChat(id?: string) {
  const userId = await getUserId();
  let chatId = id;
  if (!chatId) {
    const chat = await db.chat.create({ userId });
    chatId = chat.id;
  } else {
    let chat = await db.chat.findById(userId, chatId);
    if (!chat) {
      chat = await db.chat.create({ userId, id: chatId });
      chatId = chat.id;
    }
  }
  return chatId;
}

import { integer, text, timestamp, pgTable, uuid } from "drizzle-orm/pg-core";
import { chat } from "./chat";

export type ChatMessageRole = "user" | "ai" | "system";

export const chatMessage = pgTable("chat_message", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chat.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});

export type ChatMessageModel = typeof chatMessage.$inferSelect;
export type ChatMessageInsertModel = typeof chatMessage.$inferInsert;

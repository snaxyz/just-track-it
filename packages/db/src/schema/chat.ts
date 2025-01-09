import { relations } from "drizzle-orm";
import { text, timestamp, pgTable, uuid } from "drizzle-orm/pg-core";
import { chatMessage, ChatMessageModel } from "./chat-message";

export const chat = pgTable("chat", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(chatMessage),
}));

export type ChatModel = typeof chat.$inferSelect;
export type ChatInsertModel = typeof chat.$inferInsert;
export type ChatWithRelations = typeof chat.$inferSelect & {
  messages: ChatMessageModel[];
};

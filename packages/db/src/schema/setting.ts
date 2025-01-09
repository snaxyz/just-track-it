import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const setting = pgTable("setting", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type SettingModel = typeof setting.$inferSelect;
export type SettingInsertModel = typeof setting.$inferInsert;

import { json, pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const setting = pgTable(
  "setting",
  {
    userId: text("user_id").notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [uniqueIndex("setting_user_id_key_idx").on(table.userId, table.key)],
);

export type SettingInsertModel = typeof setting.$inferInsert;
export type SettingModel = typeof setting.$inferSelect;

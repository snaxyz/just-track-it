import { boolean, index, pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const exercise = pgTable(
  "exercise",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    keywords: text("keywords").array().$type<string[]>().notNull().default([]),
    targetAreas: text("targetAreas").array().$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", {
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "string",
    }).notNull(),
    trackSets: boolean("track_sets").notNull().default(true),
    trackReps: boolean("track_reps").notNull().default(true),
    trackWeight: boolean("track_weight").notNull().default(true),
    trackDuration: boolean("track_duration").notNull().default(false),
  },
  (table) => [
    // Index for querying by userId + createdAt (for cursor pagination)
    index("exercise_created_at_idx").on(table.userId, table.createdAt),
    // Index for querying by userId + updatedAt
    index("exercise_updated_at_idx").on(table.userId, table.updatedAt),
    // Index for querying by userId + name
    index("exercise_name_idx").on(table.userId, table.name),
    // Index for full text search on keywords
    index("exercise_keywords_idx").on(table.userId, table.keywords),
    // Unique constraint for name + userId combination
    uniqueIndex("exercise_name_user_id_idx").on(table.userId, table.name),
  ],
);

export type ExerciseModel = typeof exercise.$inferSelect;
export type ExerciseInsertModel = typeof exercise.$inferInsert;

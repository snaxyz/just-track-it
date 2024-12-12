import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import { workoutSession } from "./workout-session";

export const workout = pgTable(
  "workout",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    // Index for querying by userId + createdAt (for cursor pagination)
    index("workout_created_at_idx").on(table.userId, table.createdAt),
    // Index for querying by userId + updatedAt
    index("workout_updated_at_idx").on(table.userId, table.updatedAt),
    // Index for querying by userId + name
    index("workout_name_idx").on(table.userId, table.name),
  ]
);

export const workoutRelations = relations(workout, ({ many }) => ({
  exercises: many(exercise),
  sessions: many(workoutSession),
}));

export type WorkoutModel = typeof workout.$inferSelect;
export type WorkoutInsertModel = typeof workout.$inferInsert;

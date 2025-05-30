import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { workoutSession, WorkoutSessionWithRelations } from "./workout-session";
import {
  workoutExercise,
  WorkoutExerciseWithRelations,
} from "./workout-exercise";

export const workout = pgTable(
  "workout",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", {
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "string",
    }).notNull(),
  },
  (table) => [
    // Index for querying by userId + createdAt (for cursor pagination)
    index("workout_created_at_idx").on(table.userId, table.createdAt),
    // Index for querying by userId + updatedAt
    index("workout_updated_at_idx").on(table.userId, table.updatedAt),
    // Index for querying by userId + name
    index("workout_name_idx").on(table.userId, table.name),
    // Unique constraint for name + userId combination
    uniqueIndex("workout_name_user_id_idx").on(table.userId, table.name),
    // Unique constraint for slug + userId combination
    uniqueIndex("workout_slug_user_id_idx").on(table.userId, table.slug),
  ]
);

export const workoutRelations = relations(workout, ({ many }) => ({
  exercises: many(workoutExercise),
  sessions: many(workoutSession),
}));

export type WorkoutModel = typeof workout.$inferSelect;
export type WorkoutInsertModel = typeof workout.$inferInsert;
export type WorkoutWithRelations = typeof workout.$inferSelect & {
  exercises: WorkoutExerciseWithRelations[] | null;
  sessions: WorkoutSessionWithRelations[] | null;
};

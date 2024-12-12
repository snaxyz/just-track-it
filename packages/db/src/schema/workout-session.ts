import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { workout } from "./workout";
import { relations } from "drizzle-orm";
import { workoutSessionExercise } from "./workout-session-exercise";

export const workoutSession = pgTable(
  "workout_session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    workoutId: uuid("workout_id").references(() => workout.id),
    startedAt: timestamp("started_at").notNull(),
    completedAt: timestamp("completed_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    // Index for querying by userId + createdAt (for cursor pagination)
    index("workout_session_created_at_idx").on(table.userId, table.createdAt),
    // Index for querying by userId + updatedAt
    index("workout_session_updated_at_idx").on(table.userId, table.updatedAt),
  ]
);

export const workoutSessionRelations = relations(
  workoutSession,
  ({ one, many }) => ({
    workout: one(workout, {
      fields: [workoutSession.workoutId],
      references: [workout.id],
    }),
    exercises: many(workoutSessionExercise),
  })
);

export type WorkoutSessionModel = typeof workoutSession.$inferSelect;
export type WorkoutSessionInsertModel = typeof workoutSession.$inferInsert;

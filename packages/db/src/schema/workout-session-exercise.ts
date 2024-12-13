import { pgTable, text, uuid, json, timestamp } from "drizzle-orm/pg-core";
import { exercise, ExerciseModel } from "./exercise";
import { workoutSession } from "./workout-session";
import { relations } from "drizzle-orm";

export type WeightUnit = "kg" | "lbs";

export type WorkoutSet = {
  reps?: number;
  weight?: number;
  unit?: WeightUnit;
  duration?: number; // in seconds
  notes?: string;
};

export const workoutSessionExercise = pgTable("workout_session_exercise", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  workoutSessionId: uuid("workout_session_id")
    .notNull()
    .references(() => workoutSession.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id),
  sets: json("sets").$type<WorkoutSet[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const workoutSessionExerciseRelations = relations(
  workoutSessionExercise,
  ({ one }) => ({
    workoutSession: one(workoutSession, {
      fields: [workoutSessionExercise.workoutSessionId],
      references: [workoutSession.id],
    }),
    exercise: one(exercise, {
      fields: [workoutSessionExercise.exerciseId],
      references: [exercise.id],
    }),
  })
);

export type WorkoutSessionExerciseModel =
  typeof workoutSessionExercise.$inferSelect;
export type WorkoutSessionExerciseInsertModel =
  typeof workoutSessionExercise.$inferInsert;
export type WorkoutSessionExerciseWithRelations =
  typeof workoutSessionExercise.$inferSelect & {
    exercise: ExerciseModel;
  };

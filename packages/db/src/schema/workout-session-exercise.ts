import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { exercise, ExerciseModel } from "./exercise";
import { workoutSession } from "./workout-session";
import { workoutSet, WorkoutSetModel } from "./workout-set";
import { relations } from "drizzle-orm";

export const workoutSessionExercise = pgTable("workout_session_exercise", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  workoutSessionId: uuid("workout_session_id")
    .notNull()
    .references(() => workoutSession.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id),
});

export const workoutSessionExerciseRelations = relations(
  workoutSessionExercise,
  ({ one, many }) => ({
    workoutSession: one(workoutSession, {
      fields: [workoutSessionExercise.workoutSessionId],
      references: [workoutSession.id],
    }),
    exercise: one(exercise, {
      fields: [workoutSessionExercise.exerciseId],
      references: [exercise.id],
    }),
    sets: many(workoutSet),
  })
);

export type WorkoutSessionExerciseModel =
  typeof workoutSessionExercise.$inferSelect;
export type WorkoutSessionExerciseInsertModel =
  typeof workoutSessionExercise.$inferInsert;
export type WorkoutSessionExerciseWithRelations =
  typeof workoutSessionExercise.$inferSelect & {
    exercise: ExerciseModel;
    sets: WorkoutSetModel[];
  };

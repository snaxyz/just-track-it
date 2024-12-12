import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import { workout } from "./workout";
import { relations } from "drizzle-orm";

export const workoutExercise = pgTable("workout_exercise", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workout.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id),
});

export const workoutExerciseRelations = relations(
  workoutExercise,
  ({ one }) => ({
    workout: one(workout, {
      fields: [workoutExercise.workoutId],
      references: [workout.id],
    }),
    exercise: one(exercise, {
      fields: [workoutExercise.exerciseId],
      references: [exercise.id],
    }),
  })
);

export type WorkoutExerciseModel = typeof workoutExercise.$inferSelect;
export type WorkoutExerciseInsertModel = typeof workoutExercise.$inferInsert;

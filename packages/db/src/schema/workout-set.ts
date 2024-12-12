import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { exercise } from "./exercise";
import { workoutSession } from "./workout-session";

export type WeightUnit = "kg" | "lbs";

export const weightUnitEnum = pgEnum("weight_unit", ["kg", "lbs"]);

export const workoutSet = pgTable("workout_set", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  workoutSessionId: uuid("workout_session_id")
    .notNull()
    .references(() => workoutSession.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercise.id),
  set: integer("set"),
  reps: integer("reps"),
  weight: integer("weight"),
  unit: weightUnitEnum("weight_unit"),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const workoutSetRelations = relations(workoutSet, ({ one }) => ({
  session: one(workoutSession, {
    fields: [workoutSet.workoutSessionId],
    references: [workoutSession.id],
  }),
}));

export type WorkoutSetModel = typeof workoutSet.$inferSelect;
export type WorkoutSetInsertModel = typeof workoutSet.$inferInsert;

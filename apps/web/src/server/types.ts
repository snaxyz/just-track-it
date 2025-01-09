import { WorkoutSessionWithRelations } from "@local/db";

export type EnhancedWorkoutSession = WorkoutSessionWithRelations & {
  lastSession: WorkoutSessionWithRelations;
  isNew: boolean;
};

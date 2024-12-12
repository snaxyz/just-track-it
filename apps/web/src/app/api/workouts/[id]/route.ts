import { getUserId } from "@/server/user";
import { getWorkoutSessionsByIdServer } from "@/server/workouts/get-workout-sessions-by-id";
import { db, QueryResponse, WorkoutSessionModel } from "@local/database";

export interface EnhancedWorkoutHistory
  extends QueryResponse<WorkoutSessionModel> {
  workoutName: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const workoutId = (await params).id;
  const workoutHistory = await getWorkoutSessionsByIdServer(workoutId);

  return Response.json(workoutHistory);
}

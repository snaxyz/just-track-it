import { getUserId } from "@/server/user";
import { getWorkoutHistoryServer } from "@/server/workouts/get-workout-history";
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
  const workoutHistory = await getWorkoutHistoryServer(workoutId);

  return Response.json(workoutHistory);
}

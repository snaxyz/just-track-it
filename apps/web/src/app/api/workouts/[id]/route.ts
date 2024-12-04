import { getUserId } from "@/server/user";
import { db, QueryResponse, WorkoutHistoryModel } from "@local/database";

export interface EnhancedWorkoutHistory
  extends QueryResponse<WorkoutHistoryModel> {
  workoutName: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const workoutId = (await params).id;
  const userId = await getUserId();
  const workout = await db.workout.get(userId, workoutId);
  const workoutHistory = await db.workoutHistory.queryByWorkoutDate(
    userId,
    workoutId,
    {
      limit: 100,
      order: "desc",
    }
  );

  return Response.json({
    ...workoutHistory,
    workoutName: workout.name,
  });
}

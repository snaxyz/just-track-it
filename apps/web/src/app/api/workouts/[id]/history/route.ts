import { getWorkoutHistory } from "@/server/workouts/get-workout-history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const workoutId = (await params).id;
  const session = await getWorkoutHistory(workoutId);

  return Response.json(session);
}

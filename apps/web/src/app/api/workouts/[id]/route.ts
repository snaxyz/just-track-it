import { getWorkoutSessionsByWorkoutServer } from "@/server/workouts/get-workout-sessions-by-workout";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const workoutId = (await params).id;
  const session = await getWorkoutSessionsByWorkoutServer(workoutId);

  return Response.json(session);
}

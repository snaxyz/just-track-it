import { getWorkoutSessionsServer } from "@/server/workout-sessions/get-workout-sessions";

export async function GET() {
  const workouts = await getWorkoutSessionsServer();
  return Response.json(workouts);
}

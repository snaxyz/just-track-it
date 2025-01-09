import { getWorkoutsServer } from "@/server/workouts/get-workouts";

export async function GET() {
  const workouts = await getWorkoutsServer();
  return Response.json(workouts);
}

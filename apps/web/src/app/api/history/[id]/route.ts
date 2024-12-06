import { getWorkoutSessionServer } from "@/server/workout-sessions/get-workout-session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const historyId = (await params).id;
  const history = await getWorkoutSessionServer(historyId);

  return Response.json(history);
}

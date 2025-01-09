import { getWorkoutSessionServer } from "@/server/workout-sessions/get-workout-session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionId = (await params).id;
  const session = await getWorkoutSessionServer(sessionId);

  return Response.json(session);
}

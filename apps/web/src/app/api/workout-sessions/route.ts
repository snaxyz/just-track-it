import { getWorkoutSessionsServer } from "@/server/workout-sessions/get-workout-sessions";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limitParam = params.get("limit");
  const cursorParam = params.get("cursor");
  const limit = limitParam ? parseInt(limitParam) : undefined;
  const cursor = cursorParam ?? "";
  const workouts = await getWorkoutSessionsServer({ limit, cursor });
  return Response.json(workouts);
}

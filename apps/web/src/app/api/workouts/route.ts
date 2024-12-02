import { getUserId } from "@/server/user";
import { db } from "@local/database";

export async function GET() {
  const userId = await getUserId();
  const workouts = await db.workout.queryByDate(userId);
  return Response.json(workouts);
}

import { getUserId } from "@/server/user";
import { db } from "@local/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const historyId = (await params).id;
  const userId = await getUserId();
  const workoutHistory = await db.workoutHistory.get(userId, historyId);
  const { records } = await db.workoutHistory.queryByWorkoutDate(
    userId,
    workoutHistory.workoutId
  );

  return Response.json({
    ...workoutHistory,
    isNew: records.length === 1,
  });
}

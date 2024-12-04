import { getHistoryServer } from "@/server/workouts/get-history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const historyId = (await params).id;
  const history = await getHistoryServer(historyId);

  return Response.json(history);
}

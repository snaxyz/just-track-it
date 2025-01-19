import { getUserSettingServer } from "@/server/settings";
import { getUserId } from "@/server/user";
import { SettingKey } from "@local/db";

export async function GET(request: Request, { params }: { params: Promise<{ key: SettingKey }> }) {
  const userId = await getUserId();
  const { key } = await params;
  const setting = await getUserSettingServer(userId, key);
  return Response.json(setting ?? "");
}

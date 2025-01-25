import { getUserSettingServer } from "@/server/settings";
import { SettingKey } from "@local/db";

export async function GET(request: Request, { params }: { params: Promise<{ key: SettingKey }> }) {
  const { key } = await params;
  const setting = await getUserSettingServer(key);
  return Response.json(setting ?? "");
}

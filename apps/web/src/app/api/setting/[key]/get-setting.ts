import { SettingKey, SettingModel } from "@local/db";

export async function getUserSetting(key: SettingKey): Promise<SettingModel> {
  const response = await fetch(`/api/setting/${key}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat messages");
  }
  return await response.json();
}

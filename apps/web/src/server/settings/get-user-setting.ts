"use server";

import { db, SettingKey } from "@local/db";

export async function getUserSettingServer(userId: string, key: SettingKey) {
  return await db.setting.get(userId, key);
}

"use server";

import { db, SettingKey } from "@local/db";
import { getUserId } from "../user";

export async function updateUserSetting(key: SettingKey, value: string) {
  const userId = await getUserId();
  return await db.setting.update(userId, key, value);
}

"use server";

import { db, SettingKey } from "@local/db";
import { getUserId } from "../user";

const defaultValues: Record<SettingKey, string> = {
  weight_unit: "lbs",
  chat_collapsed: "false",
  initial_setup_completed: "false",
};

export async function getUserSettingServer(key: SettingKey) {
  const userId = await getUserId();
  const setting = await db.setting.get(userId, key);

  if (!setting) {
    const defaultValue = defaultValues[key];
    // Initialize with default value
    const newSetting = await db.setting.update(userId, key, defaultValue);
    return newSetting;
  }

  return setting;
}

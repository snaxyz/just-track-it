"use server";

import { db } from "@local/database";

export async function getUserSettings(userId: string) {
  const settings = await db.setting.get(userId);
  return {
    sidebarCollapsed: Boolean(settings?.sidebarCollapsed),
  };
}

export async function updateUserSettingSidebarCollapsed(
  userId: string,
  collapsed: boolean
) {
  return await db.setting.updateSidebarCollapse(userId, collapsed);
}

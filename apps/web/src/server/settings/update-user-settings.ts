"use server";

import { db } from "@local/db";

export async function updateUserSettingSidebarCollapsed(
  userId: string,
  collapsed: boolean
) {
  return await db.setting.updateSidebarCollapse(userId, collapsed);
}

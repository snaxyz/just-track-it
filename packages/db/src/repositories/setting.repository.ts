import { and, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { setting } from "../schema";

export type SettingKey = "sidebar_collapsed" | "initial_setup_completed" | "weight_unit";

export class SettingRepository extends BaseRepository {
  async get(userId: string, key: SettingKey) {
    return await this.db.query.setting.findFirst({
      where: and(eq(setting.userId, userId), eq(setting.key, key)),
    });
  }

  async update(userId: string, key: SettingKey, value: string) {
    const [result] = await this.db
      .insert(setting)
      .values({
        userId,
        key,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [setting.userId, setting.key],
        set: {
          value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async getSidebarCollapse(userId: string) {
    return await this.db.query.setting.findFirst({
      where: and(eq(setting.userId, userId), eq(setting.key, "sidebarCollapsed")),
    });
  }

  async updateSidebarCollapse(userId: string, collapsed: boolean) {
    return await this.db
      .update(setting)
      .set({
        key: "sidebarCollapsed",
        value: collapsed.toString(),
      })
      .where(eq(setting.userId, userId));
  }
}

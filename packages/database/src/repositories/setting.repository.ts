import { randomUUID } from "crypto";
import { UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import {
  Model,
  Repository,
  QueryOptions,
  cursorToKey,
  scanIndexForward,
  keyToCursor,
} from "./repository";

export interface SettingModel extends Model {
  sidebarCollapsed?: boolean;
}

export class SettingRepository extends Repository {
  private key = (userId: string) => ({
    pk: `#USER#${userId}#SETTING`,
    sk: `#USER#${userId}#SETTING`,
  });

  async get(userId: string): Promise<SettingModel | undefined> {
    const res = await this.client.get({
      TableName: this.tableName,
      Key: this.key(userId),
    });
    return res.Item as SettingModel | undefined;
  }

  async updateSidebarCollapse(userId: string, sidebarCollapsed: boolean) {
    await this.client.update({
      TableName: this.tableName,
      Key: this.key(userId),
      UpdateExpression: "set sidebarCollapsed = :sidebarCollapsed",
      ExpressionAttributeValues: {
        ":sidebarCollapsed": sidebarCollapsed,
      },
    });
    return sidebarCollapsed;
  }
}

import { nanoid } from "nanoid";
import {
  Repository,
  Model,
  QueryOptions,
  keyToCursor,
  cursorToKey,
  scanIndexForward,
} from "./repository";
import { QueryResponse } from "../types";

export interface ExerciseModel extends Model {
  id: string;
  userId: string;
  name: string;
}

export class ExerciseRepository extends Repository {
  private key = (userId: string, exerciseId: string) => ({
    pk: `#USER#${userId}`,
    sk: `#EXERCISE#${exerciseId}`,
  });

  private lsi1Key = (created: string, id: string) => ({
    [this.lsi1]: `#CREATED#${created}#${id}`,
  });

  private lsi2Key = (name: string) => ({
    [this.lsi2]: `#NAME#${name.toLowerCase()}`,
  });

  async create(userId: string, exercise: { name: string; keywords: string[] }) {
    const id = nanoid();
    const ts = this.timestamps();
    const item = {
      id,
      userId,
      name: exercise.name,
      ...ts,
      ...this.key(userId, id),
      ...this.lsi1Key(ts.created, id),
      ...this.lsi2Key(exercise.name),
    };

    await this.client.put({
      TableName: this.tableName,
      Item: item,
    });

    return item as ExerciseModel;
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<ExerciseModel>> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi1,
      KeyConditionExpression: "pk = :pk and begins_with(#lsi1, :lsi1)",
      ExpressionAttributeNames: {
        "#lsi1": this.lsi1,
      },
      ExpressionAttributeValues: {
        ":pk": `#USER#${userId}`,
        ":lsi1": "#CREATED#",
      },
      Limit: options.limit,
      ExclusiveStartKey: cursorToKey(options.nextCursor),
      ScanIndexForward: scanIndexForward(options.order),
    });

    const cursor = keyToCursor(res.LastEvaluatedKey);
    return {
      cursor,
      records: (res.Items ?? []) as ExerciseModel[],
    };
  }

  async update(
    userId: string,
    exerciseId: string,
    updates: Partial<{ name: string; category: string }>
  ) {
    const ts = this.timestamps();
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    if (updates.name) {
      updateExpression.push("#name = :name");
      expressionAttributeNames["#name"] = "name";
      expressionAttributeValues[":name"] = updates.name;
    }

    if (updates.category) {
      updateExpression.push("#category = :category");
      expressionAttributeNames["#category"] = "category";
      expressionAttributeValues[":category"] = updates.category;
    }

    updateExpression.push("#updated = :updated");
    expressionAttributeNames["#updated"] = "updated";
    expressionAttributeValues[":updated"] = ts.updated;

    await this.client.update({
      TableName: this.tableName,
      Key: this.key(userId, exerciseId),
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
  }

  async delete(userId: string, exerciseId: string) {
    await this.client.delete({
      TableName: this.tableName,
      Key: this.key(userId, exerciseId),
    });
  }
}

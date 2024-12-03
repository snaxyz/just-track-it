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

export interface WorkoutModel extends Model {
  id: string;
  userId: string;
  name: string;
  exercises: { exerciseId: string; reps: number; sets: number }[];
  created: string;
  updated: string;
}

export class WorkoutRepository extends Repository {
  private key = (userId: string, workoutId: string) => ({
    pk: `#USER#${userId}`,
    sk: `#WORKOUT#${workoutId}`,
  });

  /**
   * Query by created date
   */
  private lsi1Key = (created: string, id: string) => ({
    [this.lsi1]: `#CREATED#${created}#${id}`,
  });

  /**
   * Query by name
   */
  private lsi2Key = (name: string) => ({
    [this.lsi2]: this.lsi2Value(name),
  });

  private lsi2Value = (name: string) => `#NAME#${name.toLowerCase()}`;

  async create(
    userId: string,
    workout: {
      name: string;
      exercises: { exerciseId: string; reps: number; sets: number }[];
    }
  ) {
    const id = nanoid();
    const ts = this.timestamps();
    const item = {
      id,
      userId,
      name: workout.name,
      exercises: workout.exercises,
      ...ts,
      ...this.key(userId, id),
      ...this.lsi1Key(ts.created, id),
      ...this.lsi2Key(workout.name),
    };

    await this.client.put({
      TableName: this.tableName,
      Item: item,
    });

    return item as WorkoutModel;
  }

  async queryByDate(
    userId: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<WorkoutModel>> {
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
      records: (res.Items ?? []) as WorkoutModel[],
    };
  }

  async update(
    userId: string,
    workoutId: string,
    updates: Partial<{
      name: string;
      exercises: { exerciseId: string; reps: number; sets: number }[];
    }>
  ) {
    const ts = this.timestamps();
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    if (updates.name) {
      updateExpression.push("#name = :name");
      expressionAttributeNames["#name"] = "name";
      expressionAttributeValues[":name"] = updates.name;
      updateExpression.push("#lsi2 = :lsi2");
      expressionAttributeNames["#lsi2"] = this.lsi2;
      expressionAttributeValues[":lsi2"] = this.lsi2Value(updates.name);
    }

    if (updates.exercises) {
      updateExpression.push("#exercises = :exercises");
      expressionAttributeNames["#exercises"] = "exercises";
      expressionAttributeValues[":exercises"] = updates.exercises;
    }

    updateExpression.push("#updated = :updated");
    expressionAttributeNames["#updated"] = "updated";
    expressionAttributeValues[":updated"] = ts.updated;

    await this.client.update({
      TableName: this.tableName,
      Key: this.key(userId, workoutId),
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
  }

  async delete(userId: string, workoutId: string) {
    await this.client.delete({
      TableName: this.tableName,
      Key: this.key(userId, workoutId),
    });
  }
}

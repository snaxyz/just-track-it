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

export type WeightUnit = "lbs" | "kg";

export interface WorkoutHistoryExerciseSet {
  set: number;
  reps: number;
  weight?: number;
  unit?: WeightUnit;
}

export interface WorkoutHistoryExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutHistoryExerciseSet[];
}

export interface WorkoutHistoryModel extends Model {
  id: string;
  userId: string;
  workoutId: string;
  date: string;
  exercises: WorkoutHistoryExercise[];
  created: string;
  updated: string;
}

export class WorkoutHistoryRepository extends Repository {
  private key = (userId: string, historyId: string) => ({
    pk: `#USER#${userId}`,
    sk: `#HISTORY#${historyId}`,
  });

  private lsi1Key = (date: string) => ({
    [this.lsi1]: `#DATE#${date}`,
  });

  private lsi2Key = (workoutId: string, date: string) => ({
    [this.lsi2]: `#WORKOUT#${workoutId}#DATE#${date}`,
  });

  async create(
    userId: string,
    history: {
      workoutId: string;
      date: string;
      exercises: WorkoutHistoryExercise[];
    }
  ) {
    const id = nanoid();
    const ts = this.timestamps();
    const item = {
      id,
      userId,
      workoutId: history.workoutId,
      date: history.date,
      exercises: history.exercises,
      ...ts,
      ...this.key(userId, id),
      ...this.lsi1Key(history.date),
      ...this.lsi2Key(history.workoutId, history.date),
    };

    await this.client.put({
      TableName: this.tableName,
      Item: item,
    });

    return item as WorkoutHistoryModel;
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<WorkoutHistoryModel>> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi1,
      KeyConditionExpression: "pk = :pk and begins_with(#lsi1, :lsi1)",
      ExpressionAttributeNames: {
        "#lsi1": this.lsi1,
      },
      ExpressionAttributeValues: {
        ":pk": `#USER#${userId}`,
        ":lsi1": "#DATE#",
      },
      Limit: options.limit,
      ExclusiveStartKey: cursorToKey(options.nextCursor),
      ScanIndexForward: scanIndexForward(options.order),
    });

    const cursor = keyToCursor(res.LastEvaluatedKey);
    return {
      cursor,
      records: (res.Items ?? []) as WorkoutHistoryModel[],
    };
  }

  async update(
    userId: string,
    historyId: string,
    updates: Partial<{
      date: string;
      exercises: {
        exerciseId: string;
        reps: number;
        sets: number;
        weight?: number;
      }[];
    }>
  ) {
    const ts = this.timestamps();
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    if (updates.date) {
      updateExpression.push("#date = :date");
      expressionAttributeNames["#date"] = "date";
      expressionAttributeValues[":date"] = updates.date;
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
      Key: this.key(userId, historyId),
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
  }

  async delete(userId: string, historyId: string) {
    await this.client.delete({
      TableName: this.tableName,
      Key: this.key(userId, historyId),
    });
  }
}

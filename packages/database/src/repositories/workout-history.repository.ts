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
  workoutName: string;
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

  /**
   * Query by most recent workouts
   */
  private lsi1Key = (date: string) => ({
    [this.lsi1]: `#DATE#${date}`,
  });

  /**
   * Query by workout id, and most recent
   */
  private lsi2Key = (workoutId: string, date: string) => ({
    [this.lsi2]: `#WORKOUT#${workoutId}#DATE#${date}`,
  });

  async get(userId: string, historyId: string) {
    const res = await this.client.get({
      TableName: this.tableName,
      Key: this.key(userId, historyId),
    });
    if (res.Item) {
      return res.Item as WorkoutHistoryModel;
    }
    return null;
  }

  async create(
    userId: string,
    history: {
      workoutId: string;
      workoutName: string;
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
      workoutName: history.workoutName,
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

  async queryByDate(
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

  async queryByWorkoutDate(
    userId: string,
    workoutId: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<WorkoutHistoryModel>> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi2,
      KeyConditionExpression: "pk = :pk and begins_with(#lsi2, :lsi2)",
      ExpressionAttributeNames: {
        "#lsi2": this.lsi2,
      },
      ExpressionAttributeValues: {
        ":pk": `#USER#${userId}`,
        ":lsi2": `#WORKOUT#${workoutId}`,
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
      workoutName: string;
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

    if (updates.workoutName) {
      updateExpression.push("#workoutName = :workoutName");
      expressionAttributeNames["#workoutName"] = "workoutName";
      expressionAttributeValues[":workoutName"] = updates.workoutName;
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

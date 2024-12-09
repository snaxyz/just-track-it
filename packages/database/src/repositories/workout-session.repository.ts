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

export interface WorkoutSessionExerciseSet {
  reps: number;
  weight?: number;
  unit?: WeightUnit;
}

export interface WorkoutSessionExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSessionExerciseSet[];
}

export interface WorkoutSessionModel extends Model {
  id: string;
  userId: string;
  workoutId: string;
  workoutName: string;
  date: string;
  exercises: WorkoutSessionExercise[];
  created: string;
  updated: string;
}

export class WorkoutSessionRepository extends Repository {
  private key = (userId: string, sessionId: string) => ({
    pk: `#USER#${userId}#SESSION#`,
    sk: `#SESSION#${sessionId}`,
  });

  /**
   * Query by most recent workouts
   */
  private lsi1Key = (date: string) => ({
    [this.lsi1]: this.lsi1Value(date),
  });

  private lsi1Value = (date: string) => `#DATE#${date}`;

  /**
   * Query by workout id, and most recent
   */
  private lsi2Key = (workoutId: string, date: string) => ({
    [this.lsi2]: `#WORKOUT#${workoutId}#DATE#${date}`,
  });

  async get(userId: string, sessionId: string) {
    const res = await this.client.get({
      TableName: this.tableName,
      Key: this.key(userId, sessionId),
    });
    if (res.Item) {
      return res.Item as WorkoutSessionModel;
    }
    return null;
  }

  async create(
    userId: string,
    session: {
      workoutId: string;
      workoutName: string;
      date: string;
      exercises: WorkoutSessionExercise[];
    }
  ) {
    const id = nanoid();
    const ts = this.timestamps();
    const item = {
      id,
      userId,
      workoutId: session.workoutId,
      workoutName: session.workoutName,
      date: session.date,
      exercises: session.exercises,
      ...ts,
      ...this.key(userId, id),
      ...this.lsi1Key(session.date),
      ...this.lsi2Key(session.workoutId, session.date),
    };

    await this.client.put({
      TableName: this.tableName,
      Item: item,
    });

    return item as WorkoutSessionModel;
  }

  async queryByDate(
    userId: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<WorkoutSessionModel>> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi1,
      KeyConditionExpression: "pk = :pk and begins_with(#lsi1, :lsi1)",
      ExpressionAttributeNames: {
        "#lsi1": this.lsi1,
      },
      ExpressionAttributeValues: {
        ":pk": `#USER#${userId}#SESSION#`,
        ":lsi1": "#DATE#",
      },
      Limit: options.limit,
      ExclusiveStartKey: cursorToKey(options.nextCursor),
      ScanIndexForward: scanIndexForward(options.order),
    });

    const cursor = keyToCursor(res.LastEvaluatedKey);
    return {
      cursor,
      records: (res.Items ?? []) as WorkoutSessionModel[],
    };
  }

  async queryByWorkoutSessionDate(
    userId: string,
    workoutId: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<WorkoutSessionModel>> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi2,
      KeyConditionExpression: "pk = :pk and begins_with(#lsi2, :lsi2)",
      ExpressionAttributeNames: {
        "#lsi2": this.lsi2,
      },
      ExpressionAttributeValues: {
        ":pk": `#USER#${userId}#SESSION#`,
        ":lsi2": `#WORKOUT#${workoutId}`,
      },
      Limit: options.limit,
      ExclusiveStartKey: cursorToKey(options.nextCursor),
      ScanIndexForward: scanIndexForward(options.order),
    });

    const cursor = keyToCursor(res.LastEvaluatedKey);
    return {
      cursor,
      records: (res.Items ?? []) as WorkoutSessionModel[],
    };
  }

  async update(
    userId: string,
    sessionId: string,
    updates: Partial<{
      date: string;
      workoutName: string;
      exercises: WorkoutSessionExercise[];
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
      updateExpression.push("#lsi1 = :lsi1");
      expressionAttributeNames["#lsi1"] = this.lsi1;
      expressionAttributeValues[":lsi1"] = this.lsi1Value(updates.date);
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
      Key: this.key(userId, sessionId),
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
  }

  async delete(userId: string, sessionId: string) {
    await this.client.delete({
      TableName: this.tableName,
      Key: this.key(userId, sessionId),
    });
  }
}

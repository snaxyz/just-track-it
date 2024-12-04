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
import sampleExercises from "./sample-data/sample-exercises.json";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";

export interface ExerciseModel extends Model {
  id: string;
  userId: string;
  name: string;
  categories: string[];
}

export class ExerciseRepository extends Repository {
  private key = (userId: string, exerciseId: string) => ({
    pk: `#USER#${userId}#EXERCISE#`,
    sk: `#EXERCISE#${exerciseId}`,
  });

  private categoryKey = (userId: string, category: string) => ({
    pk: `#USER#${userId}#CATEGORIZED_EXERCISE#`,
    sk: `#CATEGORIZED_EXERCISE#${category}`,
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
    [this.lsi2]: `#NAME#${name.toLowerCase()}`,
  });

  /**
   *
   * Query by category and name
   */
  private lsi3Key = (category: string, name: string) => ({
    [this.lsi3]:
      `#CATEGORY#${category.toLowerCase()}#NAME#${name.toLowerCase()}`,
  });

  async create(
    userId: string,
    exercise: { name: string; categories: string[] }
  ) {
    const id = exercise.name.replace(/\s/g, "").toLowerCase();
    const ts = this.timestamps();
    const item = {
      id,
      userId,
      name: exercise.name,
      categories: exercise.categories,
      ...ts,
      ...this.key(userId, id),
      ...this.lsi1Key(ts.created, id),
      ...this.lsi2Key(exercise.name),
    };

    // check if exercise already exists
    try {
      await this.client.put({
        TableName: this.tableName,
        Item: item,
        ConditionExpression:
          "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new Error("DUPLICATE_NAME_ERROR");
      }
      throw error;
    }

    if (exercise.categories.length > 0) {
      const batchWrites = exercise.categories.map((category) => ({
        PutRequest: {
          Item: {
            ...item,
            ...this.categoryKey(userId, category),
            ...this.lsi3Key(category, exercise.name),
          },
        },
      }));

      const params = {
        RequestItems: {
          [this.tableName]: batchWrites,
        },
      };

      await this.client.batchWrite(params);
    }

    return item as ExerciseModel;
  }

  async createSampleExercises(userId: string) {
    const batchWrites = sampleExercises
      .map((exercise) => {
        const id = nanoid();
        const ts = this.timestamps();
        const item = {
          id,
          userId,
          name: exercise.name,
          categories: exercise.categories,
          ...ts,
          ...this.key(userId, id),
          ...this.lsi1Key(ts.created, id),
          ...this.lsi2Key(exercise.name),
        };

        const categoryBatchWrites = exercise.categories.map((category) => ({
          PutRequest: {
            Item: {
              ...item,
              ...this.lsi3Key(category, exercise.name),
            },
          },
        }));

        categoryBatchWrites.push({
          PutRequest: {
            Item: item,
          },
        });

        return categoryBatchWrites;
      })
      .flat();

    const params = {
      RequestItems: {
        [this.tableName]: batchWrites,
      },
    };

    try {
      await this.client.batchWrite(params);
    } catch (error) {
      console.error("Error writing batch of sample exercises", error);
      throw error;
    }
  }

  async queryByName(
    userId: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<ExerciseModel>> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi2,
      KeyConditionExpression: "pk = :pk and begins_with(#lsi2, :lsi2)",
      ExpressionAttributeNames: {
        "#lsi2": this.lsi2,
      },
      ExpressionAttributeValues: {
        ":pk": `#USER#${userId}#EXERCISE#`,
        ":lsi2": "#NAME#",
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

  async queryByCategory(
    userId: string,
    category: string,
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<ExerciseModel>> {
    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi3,
      KeyConditionExpression: "pk = :pk and begins_with(#lsi3, :lsi3)",
      ExpressionAttributeNames: {
        "#lsi3": this.lsi3,
      },
      ExpressionAttributeValues: {
        ":pk": `#USER#${userId}#EXERCISE#`,
        ":lsi3": `#CATEGORY#${category.toLowerCase()}#NAME#`,
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

  async queryByCategories(
    userId: string,
    categories: string[],
    options: QueryOptions = { limit: 100, order: "asc" }
  ): Promise<QueryResponse<ExerciseModel>> {
    const categoryConditions = categories
      .map((_, ind) => `#lsi3 = :lsi3_${ind}`)
      .join(" OR ");

    const expressionAttributeValues: Record<string, unknown> =
      categories.reduce(
        (acc, category, ind) => {
          acc[`:lsi3_${ind}`] = `#CATEGORY#${category.toLowerCase()}#NAME#`;
          return acc;
        },
        {
          ":pk": `#USER#${userId}#EXERCISE#`,
        }
      );

    const res = await this.client.query({
      TableName: this.tableName,
      IndexName: this.lsi3,
      KeyConditionExpression: "pk = :pk",
      FilterExpression: categoryConditions,
      ExpressionAttributeNames: {
        "#lsi3": this.lsi3,
      },
      ExpressionAttributeValues: expressionAttributeValues,
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
    updates: Partial<{ name: string; categories: string[] }>
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

    if (updates.categories) {
      updateExpression.push("#categories = :categories");
      expressionAttributeNames["#categories"] = "categories";
      expressionAttributeValues[":categories"] = updates.categories;
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

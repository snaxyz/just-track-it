import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { currentTimestamp } from "../utils";
import { config } from "../config";

export abstract class Repository {
  protected lsi1 = config.lsi1;
  protected lsi2 = config.lsi2;
  protected lsi3 = config.lsi3;
  protected lsi4 = config.lsi4;

  constructor(
    protected client: DynamoDBDocument,
    protected tableName: string
  ) {}

  timestamps() {
    const ts = currentTimestamp();
    return {
      created: ts,
      updated: ts,
    };
  }
}

export interface Model {
  created: string;
  updated: string;
}

export interface QueryOptions {
  nextCursor?: string;
  limit: number;
  order: "asc" | "desc";
}

export function cursorToKey<TKey>(cursor?: string): TKey | undefined {
  if (!cursor) return undefined;

  return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
}

export function keyToCursor<TKey>(key?: TKey): string | undefined {
  if (!key) return undefined;

  return Buffer.from(JSON.stringify(key)).toString("base64");
}

export function scanIndexForward(order: QueryOptions["order"]) {
  return order === "asc";
}

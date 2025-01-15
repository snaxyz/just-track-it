export { CreateWorkoutInput, CreateExerciseInput } from "./repositories";

export type QueryResponse<T> = {
  cursor: string;
  records: T[];
};

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

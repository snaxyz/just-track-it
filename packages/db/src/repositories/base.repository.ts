import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../schema";

export class BaseRepository {
  constructor(protected readonly db: PostgresJsDatabase<typeof schema>) {}
}

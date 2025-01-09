import { and, eq, gt, desc } from "drizzle-orm";
import { chat, ChatInsertModel, ChatModel } from "../schema/chat";
import { BaseRepository } from "./base.repository";
import {
  QueryResponse,
  keyToCursor,
  cursorToKey,
  QueryOptions,
} from "../types";

export class ChatRepository extends BaseRepository {
  async create(
    data: Omit<ChatInsertModel, "createdAt" | "updatedAt">
  ): Promise<ChatModel> {
    const [result] = await this.db.insert(chat).values(data).returning();
    return result;
  }

  async findById(userId: string, id: string): Promise<ChatModel | null> {
    return await this.db.query.chat.findFirst({
      where: and(eq(chat.id, id), eq(chat.userId, userId)),
    });
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 20, order: "asc" }
  ): Promise<QueryResponse<ChatModel>> {
    const cursorData = options.nextCursor
      ? cursorToKey<{ createdAt: string }>(options.nextCursor)
      : undefined;

    const chats = await this.db.query.chat.findMany({
      where: eq(chat.userId, userId),
      orderBy: options.order === "asc" ? chat.createdAt : desc(chat.createdAt),
      limit: options.limit + 1,
    });

    const hasMore = chats.length > options.limit;
    const records = hasMore ? chats.slice(0, -1) : chats;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ createdAt: lastRecord.createdAt }) : null,
    };
  }

  async update(
    userId: string,
    id: string,
    data: Partial<ChatInsertModel>
  ): Promise<ChatModel> {
    const [result] = await this.db
      .update(chat)
      .set(data)
      .where(and(eq(chat.id, id), eq(chat.userId, userId)))
      .returning();
    return result;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.db
      .delete(chat)
      .where(and(eq(chat.id, id), eq(chat.userId, userId)));
  }
}

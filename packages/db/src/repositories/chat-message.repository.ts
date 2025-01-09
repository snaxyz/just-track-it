import { and, eq, gt, desc } from "drizzle-orm";
import {
  chatMessage,
  ChatMessageInsertModel,
  ChatMessageModel,
} from "../schema/chat-message";
import { BaseRepository } from "./base.repository";
import {
  QueryResponse,
  keyToCursor,
  cursorToKey,
  QueryOptions,
} from "../types";

export class ChatMessageRepository extends BaseRepository {
  async create(
    data: Omit<ChatMessageInsertModel, "id" | "createdAt" | "updatedAt">
  ): Promise<ChatMessageModel> {
    const [result] = await this.db.insert(chatMessage).values(data).returning();
    return result;
  }

  async findById(userId: string, id: string): Promise<ChatMessageModel | null> {
    return await this.db.query.chatMessage.findFirst({
      where: and(eq(chatMessage.id, id), eq(chatMessage.userId, userId)),
    });
  }

  async query(
    userId: string,
    chatId: string,
    options: QueryOptions = { limit: 20, order: "asc" }
  ): Promise<QueryResponse<ChatMessageModel>> {
    const cursorData = options.nextCursor
      ? cursorToKey<{ createdAt: string }>(options.nextCursor)
      : undefined;

    const messages = await this.db.query.chatMessage.findMany({
      where: and(
        eq(chatMessage.chatId, chatId),
        eq(chatMessage.userId, userId)
      ),
      orderBy:
        options.order === "asc"
          ? chatMessage.createdAt
          : desc(chatMessage.createdAt),
      limit: options.limit + 1,
    });

    const hasMore = messages.length > options.limit;
    const records = hasMore ? messages.slice(0, -1) : messages;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ createdAt: lastRecord.createdAt }) : null,
    };
  }

  async update(
    userId: string,
    id: string,
    data: Partial<ChatMessageInsertModel>
  ): Promise<ChatMessageModel> {
    const [result] = await this.db
      .update(chatMessage)
      .set(data)
      .where(and(eq(chatMessage.id, id), eq(chatMessage.userId, userId)))
      .returning();
    return result;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.db
      .delete(chatMessage)
      .where(and(eq(chatMessage.id, id), eq(chatMessage.userId, userId)));
  }
}

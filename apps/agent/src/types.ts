export enum MessageType {
  ChatMessage = "chat:message",
  GenerateWorkout = "generate:workout",
}

export interface BaseMessage<T = unknown> {
  type: MessageType;
  payload: T;
}

export interface ChatMessage
  extends BaseMessage<{
    userId: string;
    chatId: string;
    message: string;
  }> {
  type: MessageType.ChatMessage;
}

export interface GenerateWorkoutMessage
  extends BaseMessage<{
    generateId: string;
    userId: string;
    message: string;
  }> {
  type: MessageType.GenerateWorkout;
}

export type Message = ChatMessage | GenerateWorkoutMessage;

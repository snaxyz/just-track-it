export interface ChatStreamEvent {
  type: "STREAM_CHAT_MESSAGE";
  userId: string;
  chatId: string;
  message: string;
  prevMessages: ChatMessage[];
  preferredResponseFormat?: ChatResponseFormat;
}

export interface ChatMessage {
  role: "ai" | "user" | "system";
  content: string;
}

export enum ChatResponseFormat {
  MARKDOWN,
  CONVERSATIONAL,
}

export interface ReviewLastResponseEvent {
  type: "REVIEW_LAST_RESPONSE";
  userId: string;
  chatId: string;
  messageId: string;
}

export interface CreateWorkoutEvent {
  type: "CREATE_WORKOUT";
  userId: string;
  chatId: string;
  messageId: string;
}

export interface CreateMultipleWorkoutsEvent {
  type: "CREATE_MULTIPLE_WORKOUTS";
  userId: string;
  chatId: string;
  messageId: string;
}

export type Event =
  | ChatStreamEvent
  | ReviewLastResponseEvent
  | CreateWorkoutEvent
  | CreateMultipleWorkoutsEvent;

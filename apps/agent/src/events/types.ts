export interface ChatMessageEvent {
  userId: string;
  chatId: string;
  messageId: string;
  content: string;
  finishReason?: string;
}

export interface WebSocketConnection {
  connectionId: string;
  userId: string;
  rooms: Set<string>;
}

export interface ApiGatewayClient {
  connectionId: string;
  queryStringParameters: Record<string, string>;
}

export interface GenerateWorkoutMessageEvent {
  content: string;
  finishReason?: string;
}

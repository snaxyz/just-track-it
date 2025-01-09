export function getChatChannel(id: string) {
  return `chat_${id}`;
}

export enum ChatEvent {
  MESSAGE_POSTED = "messagePosted",
}

export type StreamedChatData = {
  userId: string;
  chatId: string;
  messageId: string;
  content: string;
  finishReason: string | null;
};

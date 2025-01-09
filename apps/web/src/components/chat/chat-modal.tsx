"use client";

import { Dialog, DialogContent, DialogTitle, Box } from "@mui/material";
import { useState } from "react";
import { ChatMessages } from "./chat-messages";
import { ChatMessageModel, QueryResponse } from "@local/db";
import { useUserId } from "@/lib/hooks/use-user";
import { ChatInput } from "./chat-input";
import { streamAgentRequest } from "@/server/agent/stream-agent-request";
import ActiveChatResponse from "./active-chat-response";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-to-bottom";
import { useQueryClient } from "@tanstack/react-query";
import { createOrGetChat } from "@/server/chat/create-chat";
import { createUserChatMessage } from "@/server/chat/create-user-chat-message";
import ChatMessage from "./chat-message";

interface Props {
  chatId: string;
  messages: ChatMessageModel[];
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ chatId, messages, isOpen, onClose }: Props) {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const handleSendChat = (value: string) => {
    setUserMessage("");
    const startStreamAgentRequest = async () => {
      const cId = await createOrGetChat(chatId);
      const messageId = await createUserChatMessage(cId, value);
      const queryKey = ["chat-messages", chatId];
      const cache = queryClient.getQueryData<QueryResponse<ChatMessageModel>>(queryKey);

      const records = [
        ...(cache?.records ?? []),
        {
          id: messageId,
          userId: userId,
          role: "user",
          content: value,
          chatId,
        },
      ];
      const queryData = { records };
      queryClient.setQueryData(queryKey, queryData);

      streamAgentRequest({
        userId,
        chatId: cId,
        message: value,
      });
    };
    startStreamAgentRequest();
  };
  const { containerRef, scrollToBottom, onScroll } = useScrollToBottom();
  const [userMessage, setUserMessage] = useState("");

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950",
      }}
    >
      <DialogTitle className="pt-3 px-3">Ask AI</DialogTitle>
      <DialogContent className="p-0">
        <Box
          ref={containerRef}
          onScroll={onScroll}
          className="px-0 md:px-3 py-2 flex flex-col gap-2 w-full rounded-lg overflow-y-auto custom-scrollbar"
          sx={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <Box className="px-3 pt-3">
            <ChatMessage
              className="mb-0"
              message={{
                id: "1",
                chatId,
                userId,
                role: "ai",
                content:
                  "Ask me anything about your workout, diet, or health! I can also create personalized workouts—just share a bit about your needs.",
              }}
            />
          </Box>
          <ChatMessages className="pt-0" messages={messages} />
          <ActiveChatResponse id={chatId} scrollToBottom={scrollToBottom} />
        </Box>
        <Box className="px-1 md:px-3 py-2">
          <ChatInput
            placeholder="Build strength with dumbbells or Full-body, 30 minutes"
            onSubmit={handleSendChat}
            value={userMessage}
            onValueChange={setUserMessage}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

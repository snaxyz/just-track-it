"use client";

import { Box } from "@mui/material";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import ActiveChatResponse from "./active-chat-response";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatMessageModel, QueryResponse } from "@local/db";
import { useUserId } from "@/lib/hooks/use-user";
import { streamAgentRequest } from "@/server/agent/stream-agent-request";
import { createOrGetChat } from "@/server/chat/create-chat";
import { createUserChatMessage } from "@/server/chat/create-user-chat-message";
import { getChatMessages } from "@/app/api/chat/[id]/messages/get-chat-messages";

const CHAT_ID = "deadbeef-0000-4000-a000-000000000000";

export function ChatSidebar() {
  const userId = useUserId();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messagesQuery } = useQuery<QueryResponse<ChatMessageModel>>({
    queryKey: ["chat-messages", CHAT_ID],
    queryFn: () => getChatMessages(CHAT_ID),
  });

  const scrollToBottom = (force = false, instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: instant ? "instant" : "smooth",
        block: "end",
      });
    }
  };

  const handleSubmit = async (value: string) => {
    setMessage("");
    const startStreamAgentRequest = async () => {
      const chatId = await createOrGetChat(CHAT_ID);
      const messageId = await createUserChatMessage(chatId, value);
      const queryKey = ["chat-messages", CHAT_ID];
      const cache = queryClient.getQueryData<QueryResponse<ChatMessageModel>>(queryKey);

      const records = [
        ...(cache?.records ?? []),
        {
          id: messageId,
          userId: userId,
          role: "user",
          content: value,
          chatId: CHAT_ID,
        },
      ];
      const queryData = { records };
      queryClient.setQueryData(queryKey, queryData);

      streamAgentRequest({
        userId,
        chatId: CHAT_ID,
        message: value,
      });
    };
    startStreamAgentRequest();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <ChatMessages messages={messagesQuery?.records ?? []} />
        <ActiveChatResponse id={CHAT_ID} scrollToBottom={scrollToBottom} />
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <ChatInput
          value={message}
          onValueChange={setMessage}
          onSubmit={handleSubmit}
          placeholder="Ask me anything..."
        />
      </Box>
    </Box>
  );
}

"use client";

import { nanoid } from "nanoid";
import { Box, Typography } from "@mui/material";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import ActiveChatResponse from "./active-chat-response";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatMessageModel, QueryResponse } from "@local/db";
import { useUserId } from "@/lib/hooks/use-user";
import { streamAgentRequest } from "@/server/agent/stream-agent-request";
import { createOrGetChat } from "@/server/chat/create-chat";
import { createUserChatMessage } from "@/server/chat/create-user-chat-message";
import { getChatMessages } from "@/app/api/chat/[id]/messages/get-chat-messages";

const CHAT_ID = "deadbeef-0000-4000-a000-000000000000";

interface Props {
  shouldScrollToBottom?: boolean;
}

export function Chat({ shouldScrollToBottom }: Props) {
  const userId = useUserId();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messagesQuery } = useQuery<QueryResponse<ChatMessageModel>>({
    queryKey: ["chat-messages", CHAT_ID],
    queryFn: () => getChatMessages(CHAT_ID),
  });

  const scrollToBottom = (instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: instant ? "instant" : "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom(true);
    }
  }, [shouldScrollToBottom]);

  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = async (value: string) => {
    setMessage("");
    setIsThinking(true);
    const startStreamAgentRequest = async () => {
      const chatId = await createOrGetChat(CHAT_ID);
      const id = nanoid();
      const queryKey = ["chat-messages", chatId];
      const cache = queryClient.getQueryData<QueryResponse<ChatMessageModel>>(queryKey);

      const records = [
        {
          id,
          userId,
          role: "user",
          content: value,
          chatId,
        },
        ...(cache?.records ?? []),
      ];
      const queryData = { records };
      queryClient.setQueryData(queryKey, queryData);

      streamAgentRequest({
        userId,
        chatId,
        message: value,
      });

      await createUserChatMessage(chatId, value, id);
    };
    startStreamAgentRequest();
    scrollToBottom(true);
  };

  const messages = [...(messagesQuery?.records ?? [])].reverse();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
            Welcome to Just track it
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Ask me about workouts, exercises, or fitness advice. I'm here to help!
          </Typography>
        </Box>
        <ChatMessages messages={messages} />
        <ActiveChatResponse
          id={CHAT_ID}
          scrollToBottom={scrollToBottom}
          isThinking={isThinking}
          onHasMessageContent={() => setIsThinking(false)}
        />
        <div ref={messagesEndRef} />
      </Box>
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          position: "sticky",
          bottom: 0,
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
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

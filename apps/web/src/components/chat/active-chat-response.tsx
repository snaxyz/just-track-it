"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./chat-message";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatMessageModel, QueryResponse } from "@local/db";
import { useUserId } from "@/lib/hooks/use-user";
import { Box } from "@mui/material";
import { getWebSocket } from "@/lib/socket";
import { ChatMessageThinking } from "./chat-message-thinking";

interface ChatMessageEvent {
  content: string;
  finishReason?: string;
  messageId: string;
  userId: string;
}

interface Props {
  id: string;
  scrollToBottom: (force?: boolean, instant?: boolean) => void;
  isThinking?: boolean;
  onHasMessageContent?: () => void;
}

export default function ActiveChatResponse({ id, scrollToBottom, isThinking, onHasMessageContent }: Props) {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const [streamedMessage, setStreamedMessage] = useState("");
  // this ref is required to update apollo cache correctly
  const streamedMessageRef = useRef("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const initSocket = async () => {
      try {
        const socket = await getWebSocket();
        if (!mounted) return;

        socketRef.current = socket;
        console.log("Connecting to chat:", id);

        // socket.onopen = () => {
        //   socket.send(JSON.stringify({ action: "join", room: `chat:${id}` }));
        // };

        socket.onmessage = (event) => {
          const { data }: { data: ChatMessageEvent } = JSON.parse(event.data);
          const msgChunk = data.content || "";
          if (onHasMessageContent) {
            onHasMessageContent();
          }
          scrollToBottom(true);
          if (data.finishReason === "stop") {
            const queryKey = ["chat-messages", id];
            const cache = queryClient.getQueryData<QueryResponse<ChatMessageModel>>(queryKey);

            const records = [
              {
                id: data.messageId,
                userId: data.userId,
                role: "ai",
                content: streamedMessageRef.current ?? "",
                chatId: id,
              },
              ...(cache?.records ?? []),
            ];
            const queryData = { records };
            queryClient.setQueryData(queryKey, queryData);
            streamedMessageRef.current = "";
            setStreamedMessage("");
          } else {
            setStreamedMessage((msg) => msg + msgChunk);
            streamedMessageRef.current += msgChunk;
            scrollToBottom(true);
          }
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
          console.log("WebSocket connection closed");
        };

        console.log("Subscribed to chat:message events");
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    initSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [id]);

  const message = {
    chatId: id,
    userId,
    id,
    role: "ai",
    content: streamedMessage,
  };

  if (isThinking) {
    return (
      <Box sx={{ px: 1 }}>
        <ChatMessageThinking />
      </Box>
    );
  }

  return (
    streamedMessage && (
      <Box sx={{ px: 1 }}>
        <ChatMessage message={message} />
      </Box>
    )
  );
}

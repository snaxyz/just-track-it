"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "./chat-message";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatMessageModel, QueryResponse } from "@local/db";
import { useUserId } from "@/lib/hooks/use-user";
import { Box } from "@mui/material";
import { getSocketClient } from "@/lib/socket";
import { Socket } from "socket.io-client";

interface ChatMessageEvent {
  content: string;
  finishReason?: string;
  messageId: string;
  userId: string;
}

interface Props {
  id: string;
  scrollToBottom: (force?: boolean, instant?: boolean) => void;
}

export default function ActiveChatResponse({ id, scrollToBottom }: Props) {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const [streamedMessage, setStreamedMessage] = useState("");
  const streamedMessageRef = useRef("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const initSocket = async () => {
      try {
        const socket = await getSocketClient();
        if (!mounted) return;

        socketRef.current = socket;
        console.log("Connecting to chat:", id);
        socket.emit("join", `chat:${id}`);

        const handleChatMessage = (data: ChatMessageEvent) => {
          const msgChunk = data.content || "";

          if (data.finishReason === "stop") {
            const queryKey = ["chat-messages", id];
            const cache = queryClient.getQueryData<QueryResponse<ChatMessageModel>>(queryKey);
            if (!streamedMessageRef.current) return;

            const records = [
              ...(cache?.records ?? []),
              {
                id: data.messageId,
                userId: data.userId,
                role: "ai",
                content: streamedMessageRef.current,
                chatId: id,
              },
            ];
            const queryData = { records };
            queryClient.setQueryData(queryKey, queryData);
            streamedMessageRef.current = "";
            setStreamedMessage("");
          } else {
            setStreamedMessage((msg) => msg + msgChunk);
            streamedMessageRef.current += msgChunk;
            scrollToBottom();
          }
        };

        socket.on("chat:message", handleChatMessage);
        console.log("Subscribed to chat:message events");
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    initSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off("chat:message");
        socketRef.current.emit("leave", `chat:${id}`);
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

  return (
    streamedMessage && (
      <Box sx={{ px: 1 }}>
        <ChatMessage message={message} />
      </Box>
    )
  );
}

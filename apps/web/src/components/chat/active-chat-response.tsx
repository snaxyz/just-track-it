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
  sequence: number;
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
  const lastSequenceRef = useRef(-1);
  const pendingChunksRef = useRef<ChatMessageEvent[]>([]);

  const processMessageChunk = (data: ChatMessageEvent) => {
    const msgChunk = data.content || "";

    if (data.finishReason === "stop") {
      const updateCache = () => {
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
      };
      updateCache();
    } else {
      setStreamedMessage((msg) => msg + msgChunk);
      if (streamedMessageRef.current) {
        streamedMessageRef.current += msgChunk;
      } else {
        streamedMessageRef.current = msgChunk;
      }
      scrollToBottom();
    }
  };

  const processPendingChunks = () => {
    const pendingChunks = pendingChunksRef.current;
    while (pendingChunks.length > 0 && pendingChunks[0].sequence === lastSequenceRef.current + 1) {
      const chunk = pendingChunks.shift()!;
      lastSequenceRef.current = chunk.sequence;
      processMessageChunk(chunk);
    }
  };

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
          // Handle out-of-order messages
          if (data.sequence !== lastSequenceRef.current + 1) {
            // Insert chunk in correct position
            const insertIndex = pendingChunksRef.current.findIndex((chunk) => chunk.sequence > data.sequence);
            if (insertIndex === -1) {
              pendingChunksRef.current.push(data);
            } else {
              pendingChunksRef.current.splice(insertIndex, 0, data);
            }
            processPendingChunks();
            return;
          }

          // Process in-order message immediately
          lastSequenceRef.current = data.sequence;
          processMessageChunk(data);
          processPendingChunks();
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
      // Reset sequence tracking
      lastSequenceRef.current = -1;
      pendingChunksRef.current = [];
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

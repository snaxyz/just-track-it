"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { usePathname, useRouter } from "next/navigation";
import ChatMessage from "./chat-message";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatMessageModel, QueryResponse } from "@local/db";
import { useUserId } from "@/lib/hooks/use-user";
import { Box } from "@mui/material";

interface Props {
  id: string;
  scrollToBottom: (force?: boolean, instant?: boolean) => void;
}

export default function ActiveChatResponse({ id, scrollToBottom }: Props) {
  const userId = useUserId();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [streamedMessage, setStreamedMessage] = useState("");
  const streamedMessageRef = useRef("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat_${id}`);

    channel.bind("messagePosted", (data: any) => {
      const msgChunk = data.content || "";
      setStreamedMessage((msg) => msg + msgChunk);
      if (streamedMessageRef) {
        streamedMessageRef.current = (streamedMessageRef.current ?? "") + msgChunk;
      }
      if (data.finishReason === "stop") {
        setStreamedMessage("");

        const updateCache = () => {
          const queryKey = ["chat-messages", id];
          const cache = queryClient.getQueryData<QueryResponse<ChatMessageModel>>(queryKey);
          if (!streamedMessageRef.current) {
            return;
          }
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
        };

        updateCache();
      }

      scrollToBottom();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id, pathname, router, scrollToBottom, queryClient]);

  const message = {
    chatId: id,
    userId,
    id: id,
    role: "ai",
    content: streamedMessage,
  };

  return (
    streamedMessage && (
      <Box className="px-3">
        <ChatMessage className="p-2" message={message} />
      </Box>
    )
  );
}

import type { ChatMessageModel } from "@local/db";
import ChatMessage from "./chat-message";
import { cn } from "@/lib/utils";
import { Box } from "@mui/material";

interface Props {
  className?: string;
  messages: Omit<ChatMessageModel, "createdAt" | "updatedAt">[];
}

export function ChatMessages({ className, messages }: Props) {
  return (
    <Box className={cn("px-3 pt-3 flex flex-col", className)}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </Box>
  );
}

import type { ChatMessageModel } from "@local/db";
import ChatMessage from "./chat-message";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface Props {
  sx?: SxProps<Theme>;
  messages: Omit<ChatMessageModel, "createdAt" | "updatedAt">[];
}

export function ChatMessages({ sx, messages }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", px: 1, pt: 1, ...sx }}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </Box>
  );
}

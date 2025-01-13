import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BoxIcon, UserIcon } from "lucide-react";
import { Card, Box, Typography, SxProps, Theme } from "@mui/material";
import { ChatMessageModel } from "@local/db";

interface Props {
  sx?: SxProps<Theme>;
  message: Omit<ChatMessageModel, "createdAt" | "updatedAt">;
}

export default function ChatMessage({ sx, message }: Props) {
  const isUser = message.role === "user";
  const responder = isUser ? "You" : "AI";

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        bgcolor: isUser ? "transparent" : "action.hover",
        border: "none",
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          width: "100%",
          justifyContent: isUser ? "flex-end" : "flex-start",
        }}
      >
        <Box
          sx={{
            maxWidth: "85%",
            borderRadius: 1,
            px: isUser ? 2 : 1.5,
            pt: 1,
            pb: 1.5,
            bgcolor: isUser ? "primary.main" : "transparent",
            "& p": {
              m: 0,
              typography: "body2",
              color: isUser ? "primary.contrastText" : "text.primary",
            },
            "& p:not(:last-of-type)": {
              mb: 1,
            },
            "& pre": {
              mx: -1.5,
              p: 1.5,
              bgcolor: "background.paper",
              borderRadius: 1,
              overflow: "auto",
            },
            "& code": {
              fontFamily: "monospace",
              fontSize: "0.875rem",
            },
            "& ul, & ol": {
              m: 0,
              pl: 2.5,
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 0.5,
              color: isUser ? "primary.contrastText" : "text.secondary",
              fontWeight: "light",
            }}
          >
            {responder}
          </Typography>
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {message.content}
          </Markdown>
        </Box>
      </Box>
    </Card>
  );
}

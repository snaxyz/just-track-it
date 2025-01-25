"use client";

import { Card, Box, Typography } from "@mui/material";
import { ChatThinking } from "./chat-thinking";

export function ChatMessageThinking() {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        bgcolor: "action.hover",
        border: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            maxWidth: "85%",
            borderRadius: 1,
            px: 1.5,
            pt: 1,
            pb: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 0.5,
              color: "text.secondary",
              fontWeight: "light",
            }}
          >
            AI
          </Typography>
          <ChatThinking />
        </Box>
      </Box>
    </Card>
  );
}

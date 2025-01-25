"use client";

import { Box, keyframes } from "@mui/material";

const blink = keyframes`
  0% { opacity: .2; }
  20% { opacity: 1; }
  100% { opacity: .2; }
`;

export function ChatThinking() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        width: "fit-content",
        bgcolor: "action.hover",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "text.secondary",
          animation: `${blink} 1.4s infinite linear`,
        }}
      />
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "text.secondary",
          animation: `${blink} 1.4s infinite linear`,
          animationDelay: "0.2s",
        }}
      />
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "text.secondary",
          animation: `${blink} 1.4s infinite linear`,
          animationDelay: "0.4s",
        }}
      />
    </Box>
  );
}

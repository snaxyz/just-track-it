"use client";

import { Box, Avatar, Typography } from "@mui/material";

interface Props {
  name: string;
  picture?: string | null;
}

export function SidebarWorkspaceDropdown({ name, picture }: Props) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      <Avatar
        src={picture ?? undefined}
        alt={name}
        sx={{
          width: 24,
          height: 24,
        }}
      />
    </Box>
  );
}

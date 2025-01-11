import { Box, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

export function TopAppbarContainer({ children, sx }: Props) {
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

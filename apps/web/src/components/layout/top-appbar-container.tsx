import { AppBar, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  position?: "fixed" | "sticky";
}

export function TopAppbarContainer({ children, sx, position = "fixed" }: Props) {
  return (
    <AppBar
      position={position}
      color="inherit"
      elevation={0}
      sx={{
        px: 2,
        py: 1,
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      {children}
    </AppBar>
  );
}

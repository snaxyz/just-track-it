import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Title({ children }: Props) {
  return (
    <Typography
      variant="h5"
      component="h1"
      sx={{
        fontSize: {
          xs: "1.25rem", // 20px on mobile
          sm: "1.5rem", // 24px on tablet and up
        },
        fontWeight: 500,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

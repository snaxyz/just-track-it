import { Container, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function MainContainer({ children, sx }: Props) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        width: "100%",
        mx: "auto",
        ...sx,
      }}
    >
      {children}
    </Container>
  );
}

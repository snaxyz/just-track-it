import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export function FabContainer({ children }: Props) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: (theme) => theme.spacing(3),
        right: (theme) => theme.spacing(3),
        zIndex: "fab",
      }}
    >
      {children}
    </Box>
  );
}

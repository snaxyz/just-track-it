import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export function PageContainer({ children }: Props) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: { xs: "none", md: "block" },
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          width: "100%",
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </>
  );
}

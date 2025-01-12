import { Sidebar } from "@/components/layout/sidebar";
import { getUser } from "@/server/user";
import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { TopAppbar } from "@/components/layout/top-appbar";
import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await getUser();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      {children}
      <TopAppbarContainer
        sx={{
          py: 1,
          px: 2,
          display: { xs: "flex", md: "none" },
        }}
      >
        <TopAppbar user={user} />
      </TopAppbarContainer>
    </Box>
  );
}

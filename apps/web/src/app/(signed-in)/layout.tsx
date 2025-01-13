import { Sidebar } from "@/components/layout/sidebar";
import { getUser } from "@/server/user";
import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { MobileAppbar } from "@/components/layout/mobile-appbar";
import { Box, Drawer } from "@mui/material";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

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
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Sidebar />
      <TopAppbarContainer
        position="sticky"
        sx={{
          top: 0,
          display: { xs: "flex", md: "none" },
        }}
      >
        <MobileAppbar user={user} />
      </TopAppbarContainer>
      {children}
      <Drawer
        anchor="right"
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            borderLeft: 1,
            borderColor: "divider",
          },
        }}
      >
        <ChatSidebar />
      </Drawer>
    </Box>
  );
}

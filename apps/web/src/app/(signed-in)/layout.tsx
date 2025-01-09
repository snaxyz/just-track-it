import { SidebarContainer } from "@/components/layout/sidebar-container";
import { Sidebar } from "@/components/layout/sidebar";
import { getUser } from "@/server/user";
import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { TopAppbar } from "@/components/layout/top-appbar";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await getUser();

  return (
    <div className="flex h-dvh w-full text-foreground bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {children}
      <TopAppbarContainer className="flex py-1 px-2 md:hidden">
        <TopAppbar user={user}></TopAppbar>
      </TopAppbarContainer>
      <SidebarContainer className="border-r border-divider hidden md:block">
        <Sidebar user={user}></Sidebar>
      </SidebarContainer>
    </div>
  );
}

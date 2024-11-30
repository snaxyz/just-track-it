import { SidebarContainer } from "@/components/layout/sidebar-container";
import { Sidebar } from "@/components/layout/sidebar";
import { getUser } from "@/server/user";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await getUser();

  return (
    <div className="flex h-dvh w-full text-foreground bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
      <SidebarContainer className="border-r border-divider">
        <Sidebar user={user}></Sidebar>
      </SidebarContainer>
      {children}
    </div>
  );
}

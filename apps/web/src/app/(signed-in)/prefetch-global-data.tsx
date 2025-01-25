import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getUserSettingServer } from "@/server/settings";

interface Props {
  children: React.ReactNode;
}

export async function PrefetchGlobalData({ children }: Props) {
  const queryClient = new QueryClient();
  // Prefetch weight unit setting
  await queryClient.prefetchQuery({
    queryKey: ["setting-weight-unit"],
    queryFn: () => getUserSettingServer("weight_unit"),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

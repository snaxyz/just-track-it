import { getWorkoutSessionsServer } from "@/server/workout-sessions/get-workout-sessions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export async function PrefetchHistory({ children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["workout-sessions"],
    queryFn: () => getWorkoutSessionsServer({ limit: 50 }),
    initialPageParam: null,
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

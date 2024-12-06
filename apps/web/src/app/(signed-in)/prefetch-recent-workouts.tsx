import { getWorkoutSessionsServer } from "@/server/workout-sessions/get-workout-sessions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export async function PrefetchRecentWorkouts({ children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["workout-sessions"],
    queryFn: () => getWorkoutSessionsServer(),
    initialPageParam: null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

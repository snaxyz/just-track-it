import { getUserSettingServer } from "@/server/settings";
import { getWorkoutSessionServer } from "@/server/workout-sessions/get-workout-session";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
  sessionId: string;
}

export async function PrefetchWorkoutSession({ sessionId, children }: Props) {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["session", sessionId],
      queryFn: () => getWorkoutSessionServer(sessionId),
    }),
    queryClient.prefetchQuery({
      queryKey: ["setting-weight-unit"],
      queryFn: () => getUserSettingServer("weight_unit"),
    }),
  ]);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

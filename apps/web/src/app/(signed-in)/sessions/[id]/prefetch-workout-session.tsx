import { getWorkoutSessionServer } from "@/server/workout-sessions/get-workout-session";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
  historyId: string;
}

export async function PrefetchWorkoutSession({ historyId, children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["history", historyId],
    queryFn: () => getWorkoutSessionServer(historyId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

import { getWorkoutSessionServer } from "@/server/workout-sessions/get-workout-session";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
  sessionId: string;
}

export async function PrefetchWorkoutSession({ sessionId, children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getWorkoutSessionServer(sessionId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

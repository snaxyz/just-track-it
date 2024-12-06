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
  await queryClient.prefetchQuery({
    queryKey: ["workout-sessions"],
    queryFn: () => getWorkoutSessionsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

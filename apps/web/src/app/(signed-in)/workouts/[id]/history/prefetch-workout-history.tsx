import { getWorkoutHistoryServer } from "@/server/workouts/get-workout-history";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
  workoutId: string;
}

export async function PrefetchWorkoutHistory({ workoutId, children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["workout-history", workoutId],
    queryFn: () => getWorkoutHistoryServer(workoutId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

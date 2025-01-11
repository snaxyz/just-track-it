import { getExercisesServer } from "@/server/exercises/get-exercises";
import { getWorkoutsServer } from "@/server/workouts/get-workouts";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export async function PrefetchWorkouts({ children }: Props) {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["workouts"],
      queryFn: () => getWorkoutsServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["exercises"],
      queryFn: () => getExercisesServer(),
    }),
  ]);
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

import { getWorkoutsServer } from "@/server/workouts/get-workouts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export async function PrefetchWorkouts({ children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["workouts"],
    queryFn: () => getWorkoutsServer(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

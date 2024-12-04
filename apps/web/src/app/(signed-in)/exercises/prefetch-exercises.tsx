import { getExercisesServer } from "@/server/exercises/get-exercises";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export async function PrefetchExercises({ children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["exercises"],
    queryFn: () => getExercisesServer(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

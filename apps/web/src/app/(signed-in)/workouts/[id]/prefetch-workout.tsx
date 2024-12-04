import { getHistoryServer } from "@/server/workouts/get-history";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
  historyId: string;
}

export async function PrefetchWorkoutHistory({ historyId, children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["history", historyId],
    queryFn: () => getHistoryServer(historyId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

"use client";

import { PageContainer } from "@/components/layout/page-container";
import { HistoryAppbar } from "./history-appbar";
import { MainContainer } from "@/components/layout/main-container";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/use-user";
import { Title } from "@/components/title";
import { Skeleton } from "@mui/material";

export default function Loading() {
  const user = useUser();
  const params = useParams<{ id: string }>();
  return (
    <PageContainer>
      <HistoryAppbar user={user} id={params.id} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <div className="px-1">
          <Title>
            <Skeleton variant="text" width={200} height={32} />
          </Title>
        </div>
      </MainContainer>
    </PageContainer>
  );
}

"use client";

import { DateTime } from "@/components/date-time";
import { IconButton } from "@/components/icon-button";
import { Grow } from "@/components/layout/grow";
import { cn } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  className?: string;
  date: string;
  children: React.ReactNode;
}

export function WorkoutSessionHistoryCard({
  className,
  date,
  children,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={cn("mb-3 bg-zinc-200 dark:bg-zinc-800 z-0", className)}
      shadow="none"
    >
      <CardHeader className="capitalize">
        <DateTime iso={date} />
        <Grow />
        <IconButton variant="light" onPress={() => setIsExpanded((e) => !e)}>
          {isExpanded ? (
            <ChevronUpIcon size={16} />
          ) : (
            <ChevronDownIcon size={16} />
          )}
        </IconButton>
      </CardHeader>
      {isExpanded && <CardBody>{children}</CardBody>}
    </Card>
  );
}

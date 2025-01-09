"use client";

import { DateTime } from "@/components/date-time";
import { IconButton } from "@/components/icon-button";
import { Box, Card, CardContent } from "@mui/material";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  date: string;
  children: React.ReactNode;
}

export function WorkoutSessionHistoryCard({ className, date, children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn("mb-3 z-0", className)} elevation={0}>
      <CardContent>
        <Box className="flex items-center">
          <DateTime iso={date} />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setIsExpanded((e) => !e)}>
            {isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </IconButton>
        </Box>
        {isExpanded && <Box>{children}</Box>}
      </CardContent>
    </Card>
  );
}

"use client";

import { DateTime } from "@/components/date-time";
import { Box, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { ChevronUpIcon, ChevronDownIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  date: string;
  children: React.ReactNode;
}

export function WorkoutSessionHistoryCard({ id, date, children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/sessions/${id}`);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
      }}
    >
      <CardHeader
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small" onClick={handleEditClick}>
              <PencilIcon size={16} />
            </IconButton>
            <IconButton size="small" onClick={() => setIsExpanded((e) => !e)}>
              {isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
            </IconButton>
          </Box>
        }
        title={<DateTime iso={date} />}
        titleTypographyProps={{ variant: "body2", color: "text.secondary" }}
        sx={{ pb: 2 }}
      />
      {isExpanded && <CardContent>{children}</CardContent>}
    </Card>
  );
}

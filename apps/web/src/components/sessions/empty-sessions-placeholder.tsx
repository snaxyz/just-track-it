import { Button } from "@mui/material";
import { ActivityIcon, MessageSquarePlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
  onAskAIClick: () => void;
}

export function EmptySessionsPlaceholder({ onAddClick, onAskAIClick }: Props) {
  return (
    <EmptyPlaceholderCard
      Icon={ActivityIcon}
      title="No recent workouts"
      message="Start a new workout to track your progress"
    >
      <Button variant="contained" startIcon={<ActivityIcon size={16} />} color="primary" onClick={onAddClick}>
        Start new workout
      </Button>
      <Button variant="outlined" startIcon={<MessageSquarePlusIcon size={16} />} color="primary" onClick={onAskAIClick}>
        Ask AI for workout
      </Button>
    </EmptyPlaceholderCard>
  );
}

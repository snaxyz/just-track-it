import { Button } from "@mui/material";
import { DumbbellIcon, MessageSquarePlusIcon, PlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
  onAskAIClick: () => void;
}

export function EmptyWorkoutsPlaceholder({ onAddClick, onAskAIClick }: Props) {
  return (
    <EmptyPlaceholderCard Icon={DumbbellIcon} title="No workouts" message="Create your first workout to get started">
      <Button variant="outlined" startIcon={<PlusIcon size={16} />} color="primary" onClick={onAddClick}>
        Create workout
      </Button>
      <Button variant="outlined" startIcon={<MessageSquarePlusIcon size={16} />} color="primary" onClick={onAskAIClick}>
        Ask AI for workout
      </Button>
    </EmptyPlaceholderCard>
  );
}

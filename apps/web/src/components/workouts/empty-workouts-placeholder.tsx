import { Button } from "@mui/material";
import { DumbbellIcon, PlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
}

export function EmptyWorkoutsPlaceholder({ onAddClick }: Props) {
  return (
    <EmptyPlaceholderCard Icon={DumbbellIcon} title="No workouts" message="Create your first workout to get started">
      <Button variant="contained" startIcon={<PlusIcon size={16} />} color="primary" onClick={onAddClick}>
        Create workout
      </Button>
    </EmptyPlaceholderCard>
  );
}

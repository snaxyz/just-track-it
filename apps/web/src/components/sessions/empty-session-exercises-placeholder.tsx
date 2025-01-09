import { Button } from "@mui/material";
import { DumbbellIcon, PlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
}

export function EmptySessionExercisePlaceholder({ onAddClick }: Props) {
  return (
    <EmptyPlaceholderCard Icon={DumbbellIcon} title="No sets" message="Add your first exercise to get started">
      <Button variant="contained" startIcon={<PlusIcon size={16} />} color="primary" onClick={onAddClick}>
        Add set
      </Button>
    </EmptyPlaceholderCard>
  );
}

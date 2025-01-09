import { IconButton } from "@/components/icon-button";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { PencilIcon } from "lucide-react";
import { EditExerciseModal } from "./edit-exercise-modal";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  className?: string;
  id: string;
  name: string;
  categories: string[];
  onUpdate: (id: string, name: string, categories: string[]) => void;
  onDelete: (id: string) => void;
}

export function ExerciseCard({ className, id, name, categories, onUpdate, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (updatedName: string, updatedCategories: string[]) => {
    onUpdate(id, updatedName, updatedCategories);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete(id);
    setIsOpen(false);
  };

  return (
    <>
      <Card className={cn("mb-3 z-0", className)} elevation={0}>
        <CardContent>
          <Box className="flex items-center">
            <Typography className="text-nowrap text-ellipsis overflow-hidden mr-2 capitalize" title={name}>
              {name}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={() => setIsOpen(true)}>
              <PencilIcon size={16} />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="caption" className="text-default-500 mb-2">
              {categories.length === 0 ? "No categories" : "Categories"}
            </Typography>
            {categories.length > 0 && (
              <Box className="flex capitalize gap-2 flex-wrap items-center">
                {categories.map((c) => (
                  <Chip key={c} label={c} size="small" />
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      <EditExerciseModal
        key={id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name={name}
        categories={categories}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}

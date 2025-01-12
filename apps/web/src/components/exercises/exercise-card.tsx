import { Box, Card, CardContent, CardHeader, Chip, IconButton, Typography } from "@mui/material";
import { PencilIcon } from "lucide-react";
import { EditExerciseModal } from "./edit-exercise-modal";
import { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";

interface Props {
  sx?: SxProps<Theme>;
  id: string;
  name: string;
  categories: string[];
  onUpdate: (id: string, name: string, categories: string[]) => void;
  onDelete: (id: string) => void;
}

export function ExerciseCard({ sx, id, name, categories, onUpdate, onDelete }: Props) {
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
      <Card variant="outlined" sx={{ ...sx }}>
        <CardHeader
          title={name}
          action={
            <IconButton onClick={() => setIsOpen(true)} size="small">
              <PencilIcon size={16} />
            </IconButton>
          }
          sx={{
            "& .MuiCardHeader-title": {
              typography: "subtitle1",
              fontWeight: 500,
            },
          }}
        />
        {categories.length > 0 && (
          <CardContent>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {categories.map((c) => (
                <Chip key={c} label={c} size="small" />
              ))}
            </Box>
          </CardContent>
        )}
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

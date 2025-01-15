import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from "@mui/material";
import { PlusIcon, TrashIcon } from "lucide-react";
import { ExerciseCategorySelect } from "./exercise-category-select";
import { useState } from "react";

export interface EditExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, categories: string[]) => void;
  onDelete: () => void;
  name: string;
  categories: string[];
}

export function EditExerciseModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  name: initialName,
  categories: initialCategories,
}: EditExerciseModalProps) {
  const [name, setName] = useState(initialName);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  const handleSave = () => {
    onSave(name, categories);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pt: 3, px: 3 }}>Edit Exercise</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField fullWidth label="Exercise" value={name} onChange={(e) => setName(e.target.value)} />
          <ExerciseCategorySelect selectedCategories={categories} onCategoriesChange={setCategories} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <IconButton onClick={onDelete}>
          <TrashIcon size={16} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlusIcon size={16} />}
          disabled={!name}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

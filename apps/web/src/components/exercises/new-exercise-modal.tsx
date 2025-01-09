import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ExerciseCategorySelect } from "./exercise-category-select";

export interface NewExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, categories: string[]) => void;
  error?: string;
}

export function NewExerciseModal({ isOpen, onClose, onAdd, error }: NewExerciseModalProps) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setCategories([]);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        className: "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950",
      }}
    >
      <DialogTitle className="pt-3 px-3">New Exercise</DialogTitle>
      <DialogContent className="p-2">
        <Box className="space-y-4">
          <TextField
            fullWidth
            label="Exercise"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          <ExerciseCategorySelect selectedCategories={categories} onCategoriesChange={setCategories} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions className="p-2">
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlusIcon size={16} />}
          disabled={!name}
          onClick={() => onAdd(name, categories)}
        >
          Add exercise
        </Button>
      </DialogActions>
    </Dialog>
  );
}

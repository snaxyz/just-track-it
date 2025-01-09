import { ExerciseModel } from "@local/db";
import { Autocomplete, Chip, TextField } from "@mui/material";

interface Props {
  exercises: Partial<ExerciseModel>[];
  selectedExercises: string[];
  onExercisesChange: (exercises: string[]) => void;
  fullWidth?: boolean;
}

export function ExerciseSelect({ exercises, selectedExercises, onExercisesChange, fullWidth }: Props) {
  return (
    <Autocomplete
      multiple
      options={exercises}
      getOptionLabel={(option) => option.name || ""}
      value={exercises.filter((ex) => selectedExercises.includes(ex.id!))}
      onChange={(_, newValue) => {
        onExercisesChange(newValue.map((v) => v.id!));
      }}
      renderInput={(params) => <TextField {...params} label="Exercises" fullWidth={fullWidth} />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => <Chip label={option.name} {...getTagProps({ index })} />)
      }
    />
  );
}

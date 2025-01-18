import { ExerciseModel } from "@local/db";
import { Autocomplete, AutocompleteRenderGetTagProps, Chip, TextField } from "@mui/material";

interface Props {
  exercises: Partial<ExerciseModel>[];
  selectedExercises: string[];
  onExercisesChange: (exercises: string[]) => void;
  fullWidth?: boolean;
}

function renderTags(value: Partial<ExerciseModel>[], getTagProps: AutocompleteRenderGetTagProps) {
  return value.map((option, index) => {
    const { key, ...props } = getTagProps({ index });
    return <Chip key={key} label={option.name} {...props} />;
  });
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
      renderTags={renderTags}
    />
  );
}

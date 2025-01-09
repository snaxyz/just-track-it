import { ExerciseModel } from "@local/db";
import { Autocomplete, TextField } from "@mui/material";

interface Props {
  label?: string;
  exercises: ExerciseModel[];
  selectedExercise?: string;
  customExercise?: string;
  onSelectedExerciseChange: (exerciseId: string) => void;
  onCustomExerciseChange: (exercise: string) => void;
  disableCustomValue?: boolean;
  placeholder?: string;
}

export function ExerciseAutocomplete({
  label,
  exercises,
  selectedExercise,
  customExercise,
  onSelectedExerciseChange,
  onCustomExerciseChange,
  disableCustomValue,
  placeholder,
}: Props) {
  const handleChange = (_: any, newValue: ExerciseModel | string | null) => {
    if (typeof newValue === "string") {
      onCustomExerciseChange(newValue);
      onSelectedExerciseChange("");
    } else if (newValue) {
      onSelectedExerciseChange(newValue.id);
      onCustomExerciseChange(newValue.name);
    }
  };

  return (
    <Autocomplete
      freeSolo={!disableCustomValue}
      options={exercises}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return option.name;
      }}
      value={exercises.find((e) => e.id === selectedExercise) || customExercise || null}
      onChange={handleChange}
      inputValue={customExercise || ""}
      onInputChange={(_, value) => onCustomExerciseChange(value)}
      renderInput={(params) => (
        <TextField {...params} label={label ?? "Exercise"} placeholder={placeholder} className="capitalize" />
      )}
    />
  );
}

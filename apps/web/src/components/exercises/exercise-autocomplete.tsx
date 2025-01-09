import { ExerciseModel } from "@local/db";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  InputProps,
  PopoverProps,
} from "@nextui-org/react";
import { useMemo } from "react";

interface Props {
  label?: string;
  exercises: ExerciseModel[];
  selectedExercise?: string;
  customExercise?: string;
  onSelectedExerciseChange: (exerciseId: string) => void;
  onCustomExerciseChange: (exercise: string) => void;
  disableCustomValue?: boolean;
  inputProps?: Partial<InputProps>;
  placeholder?: string;
}

const autocompleteInputProps = {
  classNames: {
    input: "capitalize",
  },
};

export function ExerciseAutocomplete({
  label,
  exercises,
  selectedExercise,
  customExercise,
  onSelectedExerciseChange,
  onCustomExerciseChange,
  disableCustomValue,
  inputProps: customInputProps,
  placeholder,
}: Props) {
  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      onSelectedExerciseChange(key.toString());
      onCustomExerciseChange(
        exercises.find((e) => e.id === key.toString())!.name
      );
    }
  };

  const inputProps = useMemo(
    () => ({
      ...autocompleteInputProps,
      ...(customInputProps ?? {}),
    }),
    [customInputProps]
  );

  return (
    <Autocomplete
      label={label ?? "Exercise"}
      fullWidth
      defaultItems={exercises}
      selectedKey={selectedExercise ?? ""}
      onSelectionChange={handleSelectionChange}
      allowsCustomValue={!disableCustomValue}
      inputValue={customExercise}
      onValueChange={onCustomExerciseChange}
      inputProps={inputProps}
      isClearable={false}
      placeholder={placeholder}
    >
      {exercises.map((exercise) => (
        <AutocompleteItem
          key={exercise.id}
          value={exercise.id}
          className="capitalize"
        >
          {exercise.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}

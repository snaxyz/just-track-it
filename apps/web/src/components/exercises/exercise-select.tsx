import { ExerciseModel } from "@local/db";
import {
  Select,
  SelectItem,
  Chip,
  SelectedItems,
  Selection,
  SharedSelection,
} from "@nextui-org/react";

interface Props {
  exercises: Partial<ExerciseModel>[];
  selectedExercises: Selection;
  onExercisesChange: (keys: SharedSelection) => void;
  fullWidth?: boolean;
}

export function ExerciseSelect({
  exercises,
  selectedExercises,
  onExercisesChange,
  fullWidth,
}: Props) {
  return (
    <Select
      fullWidth={fullWidth}
      items={exercises}
      label="Exercises"
      isMultiline={true}
      selectionMode="multiple"
      placeholder="Select exercises"
      radius="lg"
      renderValue={(items: SelectedItems<Partial<ExerciseModel>>) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip key={item.key}>{item.data?.name}</Chip>
            ))}
          </div>
        );
      }}
      selectedKeys={selectedExercises}
      onSelectionChange={onExercisesChange}
    >
      {(exercise: Partial<ExerciseModel>) => (
        <SelectItem key={exercise.id} textValue={exercise.name}>
          {exercise.name}
        </SelectItem>
      )}
    </Select>
  );
}

import { ExerciseModel } from "@local/database";
import {
  Select,
  SelectItem,
  Chip,
  SelectedItems,
  Selection,
  SharedSelection,
} from "@nextui-org/react";

interface Props {
  exercises: ExerciseModel[];
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
      classNames={{
        trigger: "min-h-12 py-2",
      }}
      fullWidth={fullWidth}
      size="sm"
      items={exercises}
      label="Exercises"
      isMultiline={true}
      selectionMode="multiple"
      placeholder="Select exercises"
      radius="lg"
      renderValue={(items: SelectedItems<ExerciseModel>) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip key={item.key} size="sm">
                {item.data?.name}
              </Chip>
            ))}
          </div>
        );
      }}
      selectedKeys={selectedExercises}
      onSelectionChange={onExercisesChange}
    >
      {(exercise: ExerciseModel) => (
        <SelectItem key={exercise.id} textValue={exercise.name}>
          {exercise.name}
        </SelectItem>
      )}
    </Select>
  );
}

import { ExerciseModel, WeightUnit } from "@local/database";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { SetSelect, RepSelect, WeightSelect } from "../common";
import { PlusIcon } from "lucide-react";

export interface NewSetModalProps extends Omit<ModalProps, "children"> {
  exercises: ExerciseModel[];
  onAdd: (input: {
    selectedExercise?: string;
    customExercise?: string;
    set: string;
    reps: string;
    weight: string;
    unit: WeightUnit;
  }) => void;
  selectedExercise?: string;
  customExercise?: string;
  set: string;
  reps: string;
  weight: string;
  unit: WeightUnit;
  onSelectedExerciseChange: (exerciseId: string) => void;
  onCustomExerciseChange: (exercise: string) => void;
  onSetChange: (set: string) => void;
  onRepsChange: (reps: string) => void;
  onWeightChange: (weight: string) => void;
}

const autocompleteInputProps = {
  classNames: {
    input: "capitalize",
  },
};

export function NewSetModal({
  isOpen,
  onClose,
  exercises,
  onAdd,
  selectedExercise,
  customExercise,
  set,
  reps,
  weight,
  unit,
  onSelectedExerciseChange,
  onCustomExerciseChange,
  onSetChange,
  onRepsChange,
  onWeightChange,
}: NewSetModalProps) {
  const handleAdd = () => {
    onAdd({
      selectedExercise,
      customExercise,
      set,
      reps,
      weight,
      unit,
    });

    onClose?.();
  };

  const isValid = (selectedExercise || customExercise) && set && reps && weight;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader>New Set</ModalHeader>
        <ModalBody className="p-2">
          <Autocomplete
            label="Exercise"
            fullWidth
            defaultItems={exercises}
            selectedKey={selectedExercise ?? ""}
            onSelectionChange={(key) => {
              if (key) {
                onSelectedExerciseChange(key.toString());
                onCustomExerciseChange(
                  exercises.find((e) => e.id === key.toString())!.name
                );
              }
            }}
            allowsCustomValue
            inputValue={customExercise}
            onValueChange={onCustomExerciseChange}
            size="sm"
            inputProps={autocompleteInputProps}
            isClearable={false}
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
          <SetSelect set={set} onChange={onSetChange} disabled />
          <RepSelect reps={reps} onChange={onRepsChange} />
          <WeightSelect unit={unit} weight={weight} onChange={onWeightChange} />
        </ModalBody>
        <ModalFooter className="p-2">
          <Button
            onClick={handleAdd}
            disabled={!isValid}
            startContent={<PlusIcon size={16} />}
            radius="lg"
            variant="flat"
            size="sm"
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

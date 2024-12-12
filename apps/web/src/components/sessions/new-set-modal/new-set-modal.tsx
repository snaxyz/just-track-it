import { ExerciseModel, WeightUnit } from "@local/db";
import {
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
import { ExerciseAutocomplete } from "@/components/exercises";

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
        <ModalHeader className="pt-3 px-2">New Set</ModalHeader>
        <ModalBody className="p-2">
          <ExerciseAutocomplete
            exercises={exercises}
            selectedExercise={selectedExercise}
            customExercise={customExercise}
            onSelectedExerciseChange={onSelectedExerciseChange}
            onCustomExerciseChange={onCustomExerciseChange}
            placeholder="Select or type exercise"
          />
          <SetSelect set={set} onChange={onSetChange} disabled />
          <RepSelect reps={reps} onChange={onRepsChange} />
          <WeightSelect unit={unit} weight={weight} onChange={onWeightChange} />
        </ModalBody>
        <ModalFooter className="p-2">
          <Button
            onPress={handleAdd}
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

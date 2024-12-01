import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import {
  WorkoutHistoryExercise,
  WorkoutHistoryExerciseSet,
} from "@local/database";
import { SetSelect, RepSelect, WeightSelect } from "../common";
import { Grow } from "@/components/layout/grow";
import { DeleteIcon, TrashIcon } from "lucide-react";

interface EditWorkoutExerciseModalProps extends Omit<ModalProps, "children"> {
  id: string;
  name: string;
  sets: WorkoutHistoryExerciseSet[];
  onDeleteExercise: () => void;
  onUpdateSet: (
    set: string,
    updates: Partial<WorkoutHistoryExerciseSet>
  ) => void;
  onDeleteSet: (set: string) => void;
}

export function EditWorkoutExerciseModal({
  id,
  name,
  sets,
  onDeleteExercise,
  onUpdateSet,
  onDeleteSet,
  isOpen,
  onClose,
}: EditWorkoutExerciseModalProps) {
  const handleDeleteExercise = () => {
    // TODO: confirmation modal
    onDeleteExercise();
  };

  const handleUpdateSet = (
    setId: string,
    updates: Partial<WorkoutHistoryExerciseSet>
  ) => {
    onUpdateSet(setId, updates);
  };

  const handleDeleteSet = (setId: string) => {
    onDeleteSet(setId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader>Edit Exercise: {name}</ModalHeader>
        <ModalBody>
          {sets.map((set, ind) => (
            <div key={ind} className="mb-2">
              <div className="text-caption text-xs mb-2">Set {ind + 1}</div>
              <div className="flex items-center gap-2">
                <RepSelect
                  reps={set.reps.toString()}
                  onChange={(reps) =>
                    handleUpdateSet(set.set.toString(), {
                      reps: parseInt(reps),
                    })
                  }
                />
                {set.weight && set.unit && (
                  <WeightSelect
                    weight={set.weight?.toString()}
                    unit={set.unit}
                    onChange={(weight) =>
                      handleUpdateSet(set.set.toString(), {
                        weight: parseFloat(weight),
                      })
                    }
                  />
                )}
                <Grow />
                <Button
                  size="sm"
                  onClick={() => handleDeleteSet(set.set.toString())}
                  isIconOnly
                  radius="full"
                  variant="bordered"
                >
                  <TrashIcon size={16} />
                </Button>
              </div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <Button
            color="danger"
            onClick={handleDeleteExercise}
            className="mr-auto"
          >
            Delete Exercise
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

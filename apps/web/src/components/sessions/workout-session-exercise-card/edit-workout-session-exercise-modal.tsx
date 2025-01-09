import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { WorkoutSessionExerciseWithRelations, WorkoutSet } from "@local/db";
import { SetSelect, RepSelect, WeightSelect } from "../common";
import { Grow } from "@/components/layout/grow";
import { DeleteIcon, TrashIcon } from "lucide-react";

interface EditWorkoutExerciseModalProps extends Omit<ModalProps, "children"> {
  id: string;
  name: string;
  sets: WorkoutSet[];
  onDeleteExercise: () => void;
  onUpdateSet: (set: number, updates: Partial<WorkoutSet>) => void;
  onDeleteSet: (set: number) => void;
}

export function EditWorkoutSessionExerciseModal({
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

  const handleUpdateSet = (set: number, updates: Partial<WorkoutSet>) => {
    onUpdateSet(set, updates);
  };

  const handleDeleteSet = (set: number) => {
    onDeleteSet(set);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      scrollBehavior="inside"
    >
      <ModalContent className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950">
        <ModalHeader className="capitalize pt-3 px-2">{name}</ModalHeader>
        <ModalBody className="py-2 px-0">
          {sets.map((set, ind) => (
            <div key={ind} className="mb-2 px-2">
              <div className="flex items-center text-caption-light dark:text-caption text-xs mb-2">
                <span>Set {ind + 1}</span>
                <Grow />
                <Button
                  onPress={() => handleDeleteSet(ind)}
                  isIconOnly
                  radius="full"
                  variant="light"
                  color="danger"
                  size="sm"
                >
                  <TrashIcon size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <RepSelect
                  reps={set.reps?.toString() ?? ""}
                  onChange={(reps) =>
                    handleUpdateSet(ind, {
                      reps: parseInt(reps),
                    })
                  }
                />
                {set.weight && set.unit && (
                  <WeightSelect
                    weight={set.weight?.toString()}
                    unit={set.unit}
                    onChange={(weight) =>
                      handleUpdateSet(ind, {
                        weight: parseFloat(weight),
                      })
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter className="p-2">
          <Button
            color="danger"
            onPress={handleDeleteExercise}
            className="mr-auto"
            variant="bordered"
            size="sm"
            startContent={<TrashIcon size={16} />}
          >
            Remove exercise
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

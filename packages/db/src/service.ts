import { drizzleClient } from "./client";
import {
  ExerciseRepository,
  SettingRepository,
  WorkoutExerciseRepository,
  WorkoutRepository,
  WorkoutSessionExerciseRepository,
  WorkoutSessionRepository,
} from "./repositories";

export class DatabaseService {
  exercise: ExerciseRepository;
  setting: SettingRepository;
  workout: WorkoutRepository;
  workoutSession: WorkoutSessionRepository;
  workoutExercise: WorkoutExerciseRepository;
  workoutSessionExercise: WorkoutSessionExerciseRepository;

  constructor() {
    this.exercise = new ExerciseRepository(drizzleClient);
    this.setting = new SettingRepository(drizzleClient);
    this.workout = new WorkoutRepository(drizzleClient);
    this.workoutSession = new WorkoutSessionRepository(drizzleClient);
    this.workoutExercise = new WorkoutExerciseRepository(drizzleClient);
    this.workoutSessionExercise = new WorkoutSessionExerciseRepository(
      drizzleClient
    );
  }
}

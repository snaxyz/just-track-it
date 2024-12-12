import { drizzleClient } from "./client";
import {
  ExerciseRepository,
  SettingRepository,
  WorkoutRepository,
  WorkoutSessionRepository,
} from "./repositories";

export class DatabaseService {
  exercise: ExerciseRepository;
  setting: SettingRepository;
  workout: WorkoutRepository;
  workoutSession: WorkoutSessionRepository;

  constructor() {
    this.exercise = new ExerciseRepository(drizzleClient);
    this.setting = new SettingRepository(drizzleClient);
    this.workout = new WorkoutRepository(drizzleClient);
    this.workoutSession = new WorkoutSessionRepository(drizzleClient);
  }
}
